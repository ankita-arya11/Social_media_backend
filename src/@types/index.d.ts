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
      full_name: string | null;
      username: string | null;
      profile_picture?: string | null;
      other_data?: Record<string, any> | null;
    };
  }
}

declare namespace Express {
  export interface Request {
    user: {
      id: number;
      full_name: string | null;
      username: string | null;
      profile_picture?: string | null;
      other_data?: Record<string, any> | null;
    };
  }
}
