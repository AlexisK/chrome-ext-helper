import { Processor, DomEl } from 'core/classes';
import * as firebase from "firebase";

export const SignInPageProcessor = new Processor({
    name    : 'signin-page',
    init    : function(self) {
        self.formNode = new DomEl('form').attachTo(self.node);
        self.emailNode = this.methods.createInput(self, 'email', 'Email');
        self.passwordNode = this.methods.createInput(self, 'password', 'Password');
        self.submitNode = self.formNode.cr('input').attr({type: 'submit'});

        self.formNode.addEventListener('sumbit', ev => {
            ev.preventDefault();

            firebase.auth().signInWithEmailAndPassword(
                self.emailNode.getValue(),
                self.passwordNode.getValue()
            );
        });
    },
    methods: {
        createInput: function(self, type, label) {
            let inputBlock = self.formNode.cr('div');
            inputBlock.cr('label').value(label);
            return inputBlock.cr('input').attr({
                type,
                placeholder: label
            });
        }
    }
});
