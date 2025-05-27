import { PropertiesConfig } from './properties_config';
import { JSONConfig } from './json_config';
import { PlainConfig } from './plain_config';
export declare class ConfigService {
    readonly options: {
        configServerUrl: string;
        appId: string;
        clusterName?: string;
        secret?: string;
    };
    private readonly configManager;
    constructor(options: {
        configServerUrl: string;
        appId: string;
        clusterName?: string;
        secret?: string;
    });
    /**
     * getAppConfig, default namespace name: `application`
     */
    getAppConfig(ip?: string): Promise<PropertiesConfig>;
    /**
     * get Config by namespaceName
     */
    getConfig(namespaceName: string, ip?: string): Promise<PropertiesConfig | JSONConfig | PlainConfig>;
}
