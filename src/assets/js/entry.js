import { main } from 'main.js';
import { Vidster } from 'vidster.js';
import { Subscribe } from 'subscribe.js';

const mainForm = 'https://getfitcard.us11.list-manage.com/subscribe/post-json?u=17ce512bda68d79def8e6647a&id=27a4984128&c=?';
const partnerForm = 'https://getfitcard.us11.list-manage.com/subscribe/post-json?u=17ce512bda68d79def8e6647a&id=24276ae15c&c=?';

Subscribe('#signupMain', mainForm);
Subscribe('#signupPartners', partnerForm);
