import { PropertiesConfig } from './properties_config';
import { JSONConfig } from './json_config';
import { PlainConfig } from './plain_config';
export type ConfigManagerOptions = {
    configServerUrl: string;
    appId: string;
    clusterName: string;
    secret?: string;
};
export declare class ConfigManager {
    private readonly options;
    private LONG_POLL_RETRY_TIME;
    private MAX_LONG_POLL_RETRY_TIME;
    private MIN_LONG_POLL_RETRY_TIME;
    private configsMap;
    private configsMapVersion;
    constructor(options: ConfigManagerOptions);
    private getTypeByNamespaceName;
    getConfig(namespaceName: string, ip?: string): Promise<PropertiesConfig | JSONConfig | PlainConfig>;
    removeConfig(namespaceName: string): void;
    private updateConfigs;
    private startLongPoll;
    private formatConfigsMapKey;
    private sleep;
}
