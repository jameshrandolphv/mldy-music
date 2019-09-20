import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ContactCard } from '../app/classes/ContactCard';
import { DiscoverComponent } from '../app/components/discover/discover.component';
import { TrackService } from '../app/services/track.service';
import { UserService } from 'src/app/services/user.service';
import { Http } from '@angular/http';

describe('ContactCard', () => {
    it('can be tested', () => {
        const c = new ContactCard("James", "McAlister", true, false);
        expect(c.online).to.equal(true);
    });
});

// describe('DiscoverComponent', () => {
//     it('can be tested', () => {
//         const d = new DiscoverComponent(new TrackService(), new UserService(new Http()));
//         expect(d.dropdownOpened).to.equal(false);
//         // d.toggleDropdown(new MouseEvent("click"), d.filterOptions[0]);
//         // expect(d.dropdownOpened).to.equal(true);
//     });
// });