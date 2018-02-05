import {Application} from "core/classes";

export const NotesApplication = new Application({
    title: 'Notes',
    description: 'Keep your notes here.',
    icon: './svg/edit-1.svg',
    defaultData: {
        content: [
            {
                title: 'Group',
                content: [
                    'Data string 1'
                ]
            }
        ]
    }
});
