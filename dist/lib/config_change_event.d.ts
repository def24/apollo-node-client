import { ConfigChange } from './config_change';
export declare class ConfigChangeEvent<T> {
    private readonly namespaceName;
    private readonly configChanges;
    constructor(namespaceName: string, configChanges: Map<string, ConfigChange<T>>);
    getNamespace(): string;
    changedKeys(): string[];
    getChange(key: string): undefined | ConfigChange<T>;
}
