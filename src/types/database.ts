export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
}

export interface Booth {
  id: string;
  created_at: string;
  name: string;
  description?: string;
  owner_id: string;
  location?: string;
  status: 'active' | 'inactive';
}

export interface Story {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_id: string;
  image_url?: string;
  is_published: boolean;
}

export interface Course {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  instructor_id: string;
  price: number;
  thumbnail_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id'>;
        Update: Partial<Profile>;
      };
      booths: {
        Row: Booth;
        Insert: Omit<Booth, 'id' | 'created_at'>;
        Update: Partial<Booth>;
      };
      stories: {
        Row: Story;
        Insert: Omit<Story, 'id' | 'created_at'>;
        Update: Partial<Story>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at'>;
        Update: Partial<Course>;
      };
    };
  };
};
