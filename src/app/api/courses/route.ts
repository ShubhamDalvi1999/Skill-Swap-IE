import { NextResponse } from 'next/server';
import { AppError } from '@/lib/errors/AppError';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Define types for Supabase response data
interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  course_id: string;
  [key: string]: string | number | null;
}

interface CourseMetadata {
  course_id: string;
  learning_objectives: string[] | null;
  target_audience: string[] | null;
  prerequisites: string[] | null;
  [key: string]: string | string[] | null;
}

interface CourseTag {
  tag_id: string;
  name: string;
  slug: string | null;
  [key: string]: string | null;
}

interface CourseTagMapping {
  course_id: string;
  tag_id: string;
  tag?: CourseTag;
  [key: string]: string | CourseTag | undefined;
}

interface SupabaseCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number | null;
  level: string | null;
  duration: number | null;
  students_count: number | null;
  slug: string | null;
  status: string;
  is_featured: boolean | null;
  created_date: string;
  updated_at: string | null;
  [key: string]: string | number | boolean | null;
}

export async function GET() {
  try {
    // Create a Supabase client
    const supabase = createClient();
    
    // Fetch courses first
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published')
      .order('created_date', { ascending: false });

    if (coursesError) {
      console.error('Supabase query error:', coursesError);
      throw new Error(`Failed to fetch courses: ${coursesError.message}`);
    }
    
    // Get course IDs for further queries
    const courseIds = (courses || [])
      .map(course => course.id)
      .filter(id => id !== undefined && id !== null);
    
    if (courseIds.length === 0) {
      return NextResponse.json([]);
    }
    
    // Fetch all course modules separately
    const { data: allModules, error: modulesError } = await supabase
      .from('course_modules')
      .select('*')
      .in('course_id', courseIds)
      .order('order_index', { ascending: true });
      
    if (modulesError) {
      console.error('Supabase modules query error:', modulesError);
      // Continue anyway, just log the error
    }

    // Fetch all course metadata
    const { data: allMetadata, error: metadataError } = await supabase
      .from('course_metadata')
      .select('*')
      .in('course_id', courseIds);
      
    if (metadataError) {
      console.error('Supabase metadata query error:', metadataError);
      // Continue anyway, just log the error
    }
    
    // Fetch all course tags
    const { data: allTagMappings, error: tagsError } = await supabase
      .from('course_tag_mappings')
      .select('*, tag:course_tags(*)')
      .in('course_id', courseIds);
      
    if (tagsError) {
      console.error('Supabase tags query error:', tagsError);
      // Continue anyway, just log the error
    }

    // Group modules, metadata, and tags by course_id
    const modulesByCourseId = groupBy<CourseModule>(allModules || [], 'course_id');
    const metadataByCourseId = keyBy<CourseMetadata>(allMetadata || [], 'course_id');
    const tagsByCourseId = groupBy<CourseTagMapping>(allTagMappings || [], 'course_id');
    
    // Transform the data to match the expected format
    const formattedCourses = (courses as SupabaseCourse[]).map(course => {
      // Get modules for this course
      const courseModules = modulesByCourseId[course.id] || [];
      
      // Get metadata for this course
      const metadata = metadataByCourseId[course.id];
      
      // Get tags for this course
      const tagMappings = tagsByCourseId[course.id] || [];
      
      return {
        id: course.id,
        title: course.title,
        description: course.description || '',
        thumbnail: course.thumbnail,
        price: course.price || 0,
        level: course.level || 'Beginner',
        duration: course.duration || 0,
        studentsCount: course.students_count || 0,
        slug: course.slug || null,
        isPublished: course.status === 'published',
        isFeatured: !!course.is_featured,
        createdAt: course.created_date,
        updatedAt: course.updated_at || course.created_date,
        // Format modules
        modules: courseModules.map((module: CourseModule) => ({
          id: module.id,
          title: module.title,
          description: module.description,
          orderIndex: module.order_index
        })),
        // Format metadata
        metadata: metadata ? {
          learningObjectives: metadata.learning_objectives || [],
          targetAudience: metadata.target_audience || [],
          prerequisites: metadata.prerequisites || []
        } : null,
        // Format tags
        tags: tagMappings
          .filter((mapping: CourseTagMapping) => mapping.tag !== undefined)
          .map((mapping: CourseTagMapping) => {
            const tag = mapping.tag as CourseTag;
            return {
              id: tag.tag_id,
              name: tag.name,
              slug: tag.slug || null
            };
          })
      };
    });
    
    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    
    // Handle specific errors
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }
    
    // Handle generic errors
    return NextResponse.json(
      { error: 'Failed to fetch courses', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

// Helper functions
function groupBy<T extends { [key: string]: string | number | boolean | null | undefined | object }>(array: T[], key: string): Record<string, T[]> {
  return array.reduce((result: Record<string, T[]>, item: T) => {
    const keyValue = String(item[key]);
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    result[keyValue].push(item);
    return result;
  }, {});
}

function keyBy<T extends { [key: string]: string | number | boolean | null | undefined | object }>(array: T[], key: string): Record<string, T> {
  return array.reduce((result: Record<string, T>, item: T) => {
    const keyValue = String(item[key]);
    result[keyValue] = item;
    return result;
  }, {});
} 