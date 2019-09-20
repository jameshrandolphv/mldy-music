import { User } from './User';

export class ContactCard {
    online: boolean;
    unread: boolean;
    user: User;

    constructor(first: string, last: string, online: boolean, unread: boolean) {
        // this.user = new User(first, last);
        this.online = online;
        this.unread = unread;
    }



}
