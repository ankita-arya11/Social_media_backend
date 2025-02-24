import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: unknown;
    }
  }
}

declare namespace Express {
  export interface Request {
    user: {
      id: number;
      username: string;
      email?: string;
      full_name: string;
      profile_picture?: string;
      cover_picture?: string | null;
      location?: string | null;
      job_title?: string | null;
      university?: string | null;
      bio?: string | null;
      friends?: number;
      followings?: number;
      posts?: number;
      otp?: number | null;
      other_data?: Record<string, any> | null;
      permissions?: {
        can_create_post: boolean;
        can_create_event: boolean;
        [key: string]: any;
      };
      createdAt?: string;
      updatedAt?: string;
    };
  }
}
