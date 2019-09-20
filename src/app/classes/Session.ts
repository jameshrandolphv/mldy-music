import * as address from 'public-ip';
import * as moment from "moment";

export class Session {
    ip: string;
    location: string = "";
    lastAccess: string;
    token: string;
    userId: string;

    constructor(ip: string, token: string, userId: string) {
        this.ip = ip;
        this.userId = userId;
        this.token = token;
        this.lastAccess = moment().calendar();
    }

    public static fromJSON(json: any) {
        return new Session(json.ip, json.token, json.userId);
    }

    getJSON() {
        return { 
            "ip": this.ip,
            "token": this.token,
            "userId": this.userId,
        };
    }
}