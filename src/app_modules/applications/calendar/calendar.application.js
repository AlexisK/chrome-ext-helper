import {Application, DomEl} from "core/classes";

const colors = [
    '#f4a742',
    '#aff441',
    '#41f4bb',
    '#41ebf4',
    '#f441ac'
];

export const CalendarApplication = new Application({
    title: 'Calendar',
    description: 'Iframe!',
    icon: './svg/calendar-3.svg',
    defaultData: {
        calendars: []
    },
    createView: function() {
        this.getUrlFromEmails = emails => {
            let result = [
                'https://calendar.google.com/calendar/embed?',
                'bgcolor='+encodeURIComponent('#ffffff')
            ];
            emails.forEach((email, ind) => result.push([
                'src='+encodeURIComponent(email),
                'color='+encodeURIComponent(colors[ind % colors.length]),
                ].join('&')));
            result.push('ctz=Europe%2FKiev');
            return result.join('&');
        };

        this.pathNode = new DomEl('textarea').cls('app-navbar-input')
            .value(this.data.calendars.join(';\n'));

        this.rootNode = new DomEl('div').cls('app-application-calendar');
        this.iframeWrap = this.rootNode.cr('div').cls('iframe-wrap');
        this.iframe = this.iframeWrap.cr('iframe').attr({
            src: this.getUrlFromEmails(this.data.calendars),
            scrolling: 'no'
        });

        this.setUpNewPath = emails => {
            this.data.calendars = emails;
            this.save(this.data.calendars);
            this.iframe.attr({src: this.getUrlFromEmails(emails)});
        };

        this.pathNode.addEventListener('keyup', ev => {
            if ( ev.keyCode === 13 ) { // Enter
                this.setUpNewPath(this.pathNode.getValue().split(/;\s*/g));
            }
        });

        this.ev.subscribe('data', () => {
            this.pathNode.value(this.data.calendars.join('; '));
            this.iframe.attr({src: this.getUrlFromEmail(this.data.calendars)});
        });

        return [this.rootNode, this.pathNode];
    }
});
