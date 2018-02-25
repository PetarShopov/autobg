export class RegisterUserModel {
    constructor(
        public name: string = '',
        public username: string = '',
        public password: string = '',
        public confirmPassword: string = ''
    ) { }
}