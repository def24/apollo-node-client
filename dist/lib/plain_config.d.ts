import { AuthHeader } from './access';
import { Config } from './config';
import { ConfigInterface } from './configInterface';
import { ConfigChangeEvent } from './config_change_event';
import { ConfigOptions } from './types';
export declare class PlainConfig extends Config implements ConfigInterface {
    private configs;
    constructor(options: ConfigOptions, ip?: string);
    getAllConfig(): undefined | string;
    getProperty(_?: string, defaultValue?: string): undefined | string;
    _loadAndUpdateConfig(url: string, headers: AuthHeader | undefined): Promise<void>;
    addChangeListener(fn: (changeEvent: ConfigChangeEvent<string>) => void): PlainConfig;
    private updateConfigAndCreateChangeEvent;
}
