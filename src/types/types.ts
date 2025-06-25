export interface OAuthToken {
  token_type: string;
  expires_in: number;
  access_token: string;
}

export interface User {
  id: string;
  screen_id: string;
  name: string;
  image: string;
  profile: string;
  level: number;
  last_movie_id: string;
  is_live: boolean;
  supporter_count: number;
  supporting_count: number;
  created: number;
}

export interface App {
  client_id: string;
  name: string;
  owner_user_id: string;
}

export interface VerifyCredentialsResponse {
  app: App;
  user: User;
  supporter_count: number; // This seems to be redundant with user.supporter_count based on the example, but including as per API response.
  supporting_count: number; // Same as above for supporting_count.
}

export interface Movie {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  last_owner_comment: string;
  category: string;
  link: string;
  is_live: boolean;
  is_recorded: boolean;
  comment_count: number;
  large_thumbnail: string;
  small_thumbnail: string;
  country: string;
  duration: number;
  created: number;
  is_collabo: boolean;
  is_protected: boolean;
  max_view_count: number;
  current_view_count: number;
  total_view_count: number;
  hls_url: string;
}

export interface UserMoviesResponse {
  total_count: number;
  movies: Movie[];
}

export interface CurrentLiveResponse {
  movie: Movie;
  broadcaster: User; // Broadcaster object is similar to User
  tags: string[];
}

// For the categories and live movies by category (assuming a similar structure to movie list)
export interface Category {
  // Define properties of a category if the API provides a specific category endpoint response
  // For example: id: string; name: string;
}

export interface LiveMoviesByCategoryResponse {
  // This will likely be an array of Movie objects, potentially with some metadata
  // If the API has a dedicated endpoint for this, define its specific structure.
  // Assuming it returns a list of movies for now.
  movies: Movie[];
  // Potentially other fields like 'total_count' or 'next_page_token'
}
