import { AuthHeader } from './access';
import { Config } from './config';
import { ConfigInterface } from './configInterface';
import { ConfigChangeEvent } from './config_change_event';
import { ConfigOptions } from './types';
export type JSONBaseType = string | number | boolean | null;
export type JSONArrayType = JSONBaseType[];
export type JSONType = {
    [key: string]: JSONBaseType | JSONArrayType | JSONType;
};
export type JSONValueType = JSONBaseType | JSONArrayType | JSONType;
export declare class JSONConfig extends Config implements ConfigInterface {
    private static readonly EMPTY_CONFIG;
    private configs;
    constructor(options: ConfigOptions, ip?: string);
    isInitialized(): boolean;
    getProperty(key: string, defaultValue?: JSONValueType): undefined | JSONValueType;
    private getPropertyByJSONAndKey;
    private getPropertyByJSONAndKeySlice;
    getAllConfig(): JSONValueType;
    addChangeListener(fn: (changeEvent: ConfigChangeEvent<JSONValueType>) => void): JSONConfig;
    _loadAndUpdateConfig(url: string, headers: AuthHeader | undefined): Promise<void>;
    private diffJSON;
    private updateConfigAndCreateChangeEvent;
}
