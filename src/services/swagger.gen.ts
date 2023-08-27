/** Generate by swagger-axios-codegen */
// @ts-ignore
/* eslint-disable */

/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-ignore
import axiosStatic, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = { ...options, method, url };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export class AuthService {
  /**
   * Sign up feature
   */
  static signup(
    params: {
      /** requestBody */
      body?: AuthDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Token> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/signup';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Sign up feature
   */
  static signin(
    params: {
      /** requestBody */
      body?: AuthDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Token> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/signin';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class BookmarkService {
  /**
   * Get bookmarks
   */
  static all(
    params: {
      /**  */
      skip: string;
      /**  */
      take: string;
      /**  */
      sort: string;
      /**  */
      keyword: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/bookmarks/all';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { skip: params['skip'], take: params['take'], sort: params['sort'], keyword: params['keyword'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create bookmarks
   */
  static add(
    params: {
      /** requestBody */
      body?: BookmarkDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/bookmarks/add';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export interface AuthDto {
  /** The email of user */
  email: string;

  /** The password of the account */
  password: string;
}

export interface Token {}

export interface BookmarkDto {
  /** The title of the bookmark */
  title: string;

  /** The description of the bookmark */
  description: string;

  /** The link of the bookmark */
  link: string;
}
