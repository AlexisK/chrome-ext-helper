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
        this.rootContent = this.rootNode.cr('div').cls('content');


        // render
        this.renderField = (data) => {
            if ( /^https?:\/\//.exec(data) ) {
                return new DomEl('a').value(data).attr({href: data, target: 'blank'});
            } else {
                return new DomEl('div').value(data);
            }
        };

        this.renderDirectory = (elem, parent = this.rootContent, parentElem = {}) => {
            elem.content = elem.content || [];
            let wrapNode = parent.cr('div').cls('directory ' + (elem.isEditing && 'edit-mode' || 'view-mode'));
            let directories = elem.content.filter(v => (typeof(v) === 'object'));

            // title
            let titleBar = wrapNode.cr('div').cls('group-title');
            titleBar
                .cr('button')
                .cr('img').attr({src: elem.isOpened && 'svg/folder-10.svg' || 'svg/folder-5.svg'});
            titleBar
                .cr('button').cls('right')
                .addEventListener('mousedown', ev => {
                    ev.preventDefault();
                    elem.isEditing = !elem.isEditing;
                    this.save(elem);
                })
                .cr('img').attr({src: elem.isEditing && 'svg/locked-1.svg' || 'svg/locked.svg'});
            if ( parentElem.isEditing ) {
                titleBar
                    .cr('button').cls('right')
                    .addEventListener('click', ev => {
                        ev.preventDefault();
                        modalService.confirm('Delete '+elem.title+'?').then(() => {
                            let ind = parentElem.content.indexOf(elem);
                            if ( ind >= 0 ) {
                                parentElem.content.splice(ind, 1);
                                this.save(parentElem.content);
                            }
                        });
                    })
                    .cr('img').attr({src: 'svg/garbage.svg'});
                titleBar
                    .cr('button').cls('right')
                    .addEventListener('click', ev => {
                        ev.preventDefault();
                        let ind = parentElem.content.indexOf(elem);
                        if ( ind > 0 ) {
                            parentElem.content.splice(ind, 1);
                            parentElem.content.splice(ind-1, 0, elem);
                            this.save(parentElem.content);
                        }
                    })
                    .cr('img').attr({src: 'svg/arr-top.svg'});
                titleBar
                    .cr('button').cls('right')
                    .addEventListener('click', ev => {
                        ev.preventDefault();
                        let ind = parentElem.content.indexOf(elem);
                        if ( ind >= 0 && ind < parentElem.content.length-1 ) {
                            parentElem.content.splice(ind, 1);
                            parentElem.content.splice(ind+1, 0, elem);
                            this.save(parentElem.content);
                        }
                    })
                    .cr('img').attr({src: 'svg/arr-bottom.svg'});
            }
            titleBar.cr('strong')
                .addEventListener('mousedown', () => {
                    elem.isOpened = !elem.isOpened;
                    this.save(elem);
                })
                .value(elem.title || 'ROOT');


            // body
            if ( elem.isOpened ) {
                let groupNode = wrapNode.cr('div').cls('group');
                directories.forEach(d => this.renderDirectory(d, groupNode, elem));
                let lines = elem.content.filter(v => (typeof(v) === 'string'));

                if ( elem.isEditing ) {
                    groupNode
                        .cr('div').cls('input')
                        .cr('input').attr({type: 'text', placeholder: 'new group...'})
                        .addEventListener('keyup', ev => {
                            if ( ev.keyCode === 13 ) {
                                elem.content.push({
                                    title: ev.target.value,
                                    isOpened: true,
                                    isEditing: true,
                                    content: []
                                });
                                this.save(elem.content);
                            }
                        });
                    let savedValue = lines.join('\n');
                    let textarea = groupNode
                        .cr('div').cls('input')
                        .cr('textarea').cls('mat-textarea').attr({placeholder: 'text here...'})
                        .value(savedValue)
                        .addEventListener('blur', ev => {
                            let value = ev.target.value;
                            if ( value !== savedValue ) {
                                savedValue = value;
                                elem.content = [...directories, ...value.split('\n')];
                                this.save(elem.content);
                            }
                        })
                        .addEventListener('keyup', ev => {
                            let node = ev.target;
                            elem.content = [...directories, ...node.value.split('\n')];
                            node.style.minHeight = node.scrollHeight + 'px';
                        });
                    setTimeout(() => textarea.node.style.minHeight = textarea.node.scrollHeight + 'px', 1);

                } else {
                    lines.forEach(str => {
                        if ( str.length ) {
                            let node = groupNode.cr('div').cls('input');
                            let values = str.split(/\s*:\s+/);
                            if ( values.length === 1) {
                                node.cr('div').value(str);
                            } else {
                                node.cls('input key-val');

                                for ( let i = 0, len = values.length-1; i < len; i++ ) {
                                    this.renderField(values[i]).cls('key').attachTo(node);
                                }
                                this.renderField(values[values.length-1]).attachTo(node);
                            }
                        }
                    });
                }
            }


        };

        this.ev.subscribe('data', () => {
            this.rootContent.value('');
            this.renderDirectory(this.data);
        });

        this.renderDirectory(this.data);

        return [this.rootNode];
    }
});
