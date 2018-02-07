import {Application} from "core/classes";
import {DomEl} from "../../core/classes";

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
    },
    createView: function() {
        this.rootNode = new DomEl('div').cls('app-application-notes');
        this.rootContent = this.rootNode.cr('div').cls('content');

        this.renderData = (dataList = [], parentNode = this.rootContent) => {
            dataList.forEach((elem, ind) => {
                if ( typeof(elem) === 'object') {
                    parentNode.cr('strong').value(elem.title);
                    this.renderData(elem.content, parentNode.cr('div').cls('group'));
                } else {
                    parentNode
                        .cr('input').cls('input').attr({type: 'text'}).value(elem)
                        .addEventListener('keyup', ev => {
                            ev.target.classList.add('dirty');
                            if ( ev.keyCode === 13 ) {
                                let val = ev.target.value;
                                if ( val.length === 0 ) {
                                    dataList.splice(ind, 1);
                                } else {
                                    dataList[ind] = val;
                                }
                                this.save();
                            }
                        });
                }
            });
            parentNode
                .cr('input').cls('input').attr({type: 'text', placeholder: 'new record...'})
                .addEventListener('keyup', ev => {
                    if ( ev.keyCode === 13 ) {
                        dataList.push(ev.target.value);
                        this.save();
                    }
                });
        };

        this.ev.subscribe('data', () => {
            this.rootContent.value('');
            this.renderData(this.data.content);
        });

        this.renderData(this.data.content);

        return this.rootNode;
    }
});
