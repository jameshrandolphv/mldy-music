export class Track {
  _id?: string;
  contentLink: string;
  filetype: string;
  lengthInSeconds: number;
  title: string;
  description: string;
  tags: string[];
  datePosted: string;
  primaryAuthorId: string;
  secondaryAuthorIds: string[];
  views: number;
  userVisible = true;

  constructor(contentLink: string, filetype: string, lengthInSeconds: number, title: string,
    description: string, tags: string[], datePosted: string,
    primaryAuthorId: string, secondaryAuthorIds: string[], views: number, _id?: string) {
      this.contentLink = contentLink;
      this.filetype = filetype;
      this.lengthInSeconds = lengthInSeconds;
      this.title = title;
      this.description = description;
      this.tags = tags;
      this.datePosted = datePosted;
      this.primaryAuthorId = primaryAuthorId;
      this.secondaryAuthorIds = secondaryAuthorIds;
      this.views = views;
      this._id = _id;
  }

  getJSON() {
    return {
      "contentLink": this.contentLink,
      "filetype": this.filetype,
      "lengthInSeconds": this.lengthInSeconds,
      "title": this.title,
      "description": this.description,
      "tags": this.tags,
      "datePosted": this.datePosted,
      "authorIds": {
        "primary": this.primaryAuthorId,
        "secondary": this.secondaryAuthorIds
      },
      "views": this.views
    };
  }

  // tslint:disable-next-line:member-ordering
  public static fromJSON(json: any) {
    return new Track(json.contentLink, json.filetype, json.lengthInSeconds, json.title, json.description, json.tags, json.datePosted,
      json.authorIds.primary, json.authorIds.secondary, json.views, json._id);
  }
}