export interface MovieModel {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  genre: string[];
  rating: string;
  cast: string[];
  director: string;
  writers: string[];
  producers: string[];
  release_date: string;
  country: string;
  language: string;
  budget: number;
  revenue: number;
  production_company: string;
  distributor: string;
  image_url: string;
  trailer_url: string;
  awards: string[];
  details: Record<string, any>;
  created_at: string;
  updated_at: string;
}