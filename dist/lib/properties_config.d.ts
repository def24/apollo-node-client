import { AuthHeader } from './access';
import { Config } from './config';
import { ConfigInterface } from './configInterface';
import { ConfigChangeEvent } from './config_change_event';
import { ConfigOptions } from './types';
export type KVConfigContentType = {
    [key: string]: string;
};
export declare class PropertiesConfig extends Config implements ConfigInterface {
    private configs;
    constructor(options: ConfigOptions, ip?: string);
    getProperty(key: string, defaultValue?: string): undefined | string;
    getAllConfig(): Map<string, string>;
    private setProperty;
    private deleteProperty;
    addChangeListener(fn: (changeEvent: ConfigChangeEvent<string>) => void): PropertiesConfig;
    _loadAndUpdateConfig(url: string, headers: AuthHeader | undefined): Promise<void>;
    private diffMap;
    private updateConfigAndCreateChangeEvent;
}
