export type AuthHeader = {
    Authorization: string;
    Timestamp: string;
};
export declare class Access {
    static DELIMITER: string;
    static createAccessHeader(appId: string, url: string, secret: string): AuthHeader;
    private static createAccessHeaderByTimestamp;
    private static signature;
    private static url2PathWithQuery;
}
