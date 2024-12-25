declare module 'cloudinary' {
  import {
    UploadApiResponse,
    UploadApiOptions,
    ConfigOptions,
  } from 'cloudinary/types';

  interface UploadApiResponse {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    original_filename: string;
  }

  interface ConfigOptions {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }

  namespace v2 {
    const uploader: {
      upload(
        path: string,
        options?: UploadApiOptions
      ): Promise<UploadApiResponse>;
    };
    const config: (options: ConfigOptions) => void;
  }

  export = v2;
}
