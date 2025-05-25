import { PropertyChangeType } from './constants';
export declare class ConfigChange<T> {
    private readonly namespaceName;
    private readonly propertyName;
    private readonly oldValue;
    private readonly newValue;
    private readonly changeType;
    constructor(namespaceName: string, propertyName: string, oldValue: undefined | T, newValue: undefined | T, changeType: PropertyChangeType);
    getNamespace(): string;
    getPropertyName(): string;
    getOldValue(): undefined | T;
    getNewValue(): undefined | T;
    getChangeType(): PropertyChangeType;
}
