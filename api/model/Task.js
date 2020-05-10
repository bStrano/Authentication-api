class Task {
    name;
    note;
    deadline;
    points;
    notification;
    completed;
    usuario;

    constructor (name, note, deadline, points, notification, completed, usuario) {
        this.name = name;
        this.note = note;
        this.deadline = deadline;
        this.points = points;
        this.notification = notification;
        this.completed = completed;
        this.usuario = usuario;
    }
}