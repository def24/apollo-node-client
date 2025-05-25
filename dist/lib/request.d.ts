import { HeadersInit } from 'node-fetch';
import { ConfigInterface } from './configInterface';
export type ConfigUrlOptions = {
    configServerUrl: string;
    appId: string;
    clusterName: string;
    namespaceName: string;
    releaseKey?: string;
    ip?: string;
};
export type NotificationsUrlOptions = {
    configServerUrl: string;
    appId: string;
    clusterName: string;
};
export type ConfigQueryParam = {
    releaseKey: string;
    ip: string;
};
export type Notification = {
    namespaceName: string;
    notificationId: number;
};
export type LoadConfigResp<T> = {
    appId: string;
    cluster: string;
    namespaceName: string;
    configurations: T;
    releaseKey: string;
};
export declare class Request {
    static formatConfigUrl(urlOptions: ConfigUrlOptions): string;
    static fetchConfig<T>(url: string, headers?: HeadersInit): Promise<LoadConfigResp<T> | null>;
    static formatNotificationsUrl(options: NotificationsUrlOptions, configsMap: Map<string, ConfigInterface>): string;
    static fetchNotifications(url: string, headers?: HeadersInit): Promise<Notification[] | null>;
}
