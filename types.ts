
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  isShielded: boolean;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: string;
}

export interface AppState {
  currentUser: User;
  posts: Post[];
  isBlurred: boolean;
}
