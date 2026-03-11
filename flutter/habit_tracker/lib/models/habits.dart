class Habits {
  String id;
  String title;
  String description;
  DateTime createdAt;
  List<DateTime> completedDates;

  Habits(this.id, this.title, this.description, this.createdAt, this.completedDates) {
    completedDates = [];
    createdAt = createdAt;
    description = description;
    title = title;
    id = id;
    }
}