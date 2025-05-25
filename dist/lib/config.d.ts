/// <reference types="node" />
import { EventEmitter } from 'stream';
import { AuthHeader } from './access';
import { ConfigOptions } from './types';
export declare abstract class Config extends EventEmitter {
    private readonly options;
    private readonly ip?;
    private releaseKey;
    private notificationId;
    constructor(options: ConfigOptions, ip?: string | undefined);
    getNamespaceName(): string;
    getNotificationId(): number;
    setNotificationId(newNotificationId: number): void;
    protected getConfigOptions(): ConfigOptions;
    protected getAppId(): string;
    protected getSecret(): undefined | string;
    protected getReleaseKey(): string;
    protected setReleaseKey(releaseKey: string): void;
    protected getIp(): undefined | string;
    loadAndUpdateConfig(): Promise<void>;
    abstract _loadAndUpdateConfig(url: string, headers: AuthHeader | undefined): Promise<void>;
}
