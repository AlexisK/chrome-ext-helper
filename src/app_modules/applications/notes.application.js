import {Application, DomEl} from "core/classes";
import {modalService} from "core/services";

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
    isWide: true,
    createView: function() {
        this.isInEditState = false;
        this.rootNode = new DomEl('div').cls('app-application-notes');

        this.editButton = this.rootNode
            .cr('button')
            .addEventListener('click', () => {
                this.rootContent.value('');
                this.isInEditState = !this.isInEditState;
                this.renderData(this.data.content);
            })
            .cr('img').attr({src: 'svg/edit.svg'});

        this.rootContent = this.rootNode.cr('div').cls('content');

        this.drawInput = (parent, value) => {
            let wrapNode = parent.cr('div').cls('input');

            if ( this.isInEditState ) {
                return wrapNode.cr('input').attr({type: 'text'}).value(value);
            }
            let values = value.split(/\s*:\s+/);
            if ( values.length === 1) {
                return wrapNode.cr('div').value(value);
            }
            values[1] = values.slice(1).join(': ');
            wrapNode.cr('div').cls('key').value(values[0]);
            if ( /^https?:\/\//.exec(values[1]) ) {
                return wrapNode.cr('a').value(values[1]).attr({href: values[1], target: 'blank'});
            }
            return wrapNode.cr('div').value(values[1]);
        };

        this.renderData = (dataList = [], parentNode = this.rootContent) => {
            if ( this.isInEditState ) {
                parentNode
                    .cr('div').cls('input')
                    .cr('input').attr({type: 'text', placeholder: 'new group...'})
                    .addEventListener('keyup', ev => {
                        if ( ev.keyCode === 13 ) {
                            dataList.push({
                                title: ev.target.value,
                                isOpened: true,
                                content: []
                            });
                            this.save();
                        }
                    });
            }
            dataList.forEach((elem, ind) => {
                if ( typeof(elem) === 'object') {
                    elem.content = elem.content || [];

                    let titleBar = parentNode.cr('div').cls('group-title');

                    titleBar
                        .cr('button')
                        .addEventListener('mousedown', () => {
                            elem.isOpened = !elem.isOpened;
                            this.save();
                        })
                        .cr('img').attr({src: elem.isOpened && 'svg/folder-10.svg' || 'svg/folder-5.svg'});

                    if ( this.isInEditState ) {
                        titleBar
                            .cr('button')
                            .addEventListener('click', () => {
                                modalService.confirm('Delete '+elem.title+'?').then(() => {
                                    dataList.splice(ind, 1);
                                    this.save();
                                });
                            })
                            .cr('img').attr({src: 'svg/garbage.svg'});
                        titleBar
                            .cr('button')
                            .addEventListener('click', () => {
                                if ( ind > 0 ) {
                                    dataList.splice(ind, 1);
                                    dataList.splice(ind-1, 0, elem);
                                    this.save();
                                }
                            })
                            .cr('img').attr({src: 'svg/arr-top.svg'});
                        titleBar
                            .cr('button')
                            .addEventListener('click', () => {
                                if ( ind < dataList.length - 1 ) {
                                    dataList.splice(ind, 1);
                                    dataList.splice(ind+1, 0, elem);
                                    this.save();
                                }
                            })
                            .cr('img').attr({src: 'svg/arr-bottom.svg'});
                    }
                    titleBar.cr('strong').value(elem.title);
                    if ( elem.isOpened ) {
                        this.renderData(elem.content, parentNode.cr('div').cls('group'));
                    }
                } else {
                    let inp = this.drawInput(parentNode, elem);
                    if ( this.isInEditState ) {
                        inp.addEventListener('keyup', ev => {
                            ev.target.classList.add('dirty');
                            if (ev.keyCode === 13) {
                                let val = ev.target.value;
                                if (val.length === 0) {
                                    dataList.splice(ind, 1);
                                } else {
                                    dataList[ind] = val;
                                }
                                this.save();
                            }
                        });
                    }
                }
            });
            if ( this.isInEditState ) {
                parentNode
                    .cr('div').cls('input')
                    .cr('input').attr({type: 'text', placeholder: 'new record...'})
                    .addEventListener('keyup', ev => {
                        if ( ev.keyCode === 13 ) {
                            dataList.push(ev.target.value);
                            this.save();
                        }
                    });
            }
        };

        this.ev.subscribe('data', () => {
            this.rootContent.value('');
            this.renderData(this.data.content);
        });

        this.renderData(this.data.content);

        return this.rootNode;
    }
});
