/* eslint-disable */

// *******************************************************
// *******************************************************
//
// GENERATED FILE, DO NOT MODIFY
//
// Made by Victor Garcia ®
//
// https://github.com/victorgarciaesgi
// *******************************************************
// *******************************************************
// 💙

export type Maybe<T> = T | null;

export interface Classtype {
  id: string;
  created_at: string;
  updated_at: string;
  level: number;
  classrooms: Maybe<ClassroomConnection>;
  exams: Maybe<ExamConnection>;
  packagequestions: Maybe<PackagequestionConnection>;
  questions: Maybe<QuestionConnection>;
}

/** A paginated list of Classroom edges. */
export interface ClassroomConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Classroom edges.*/
  edges: ClassroomEdge[];
}

/** Information about pagination using a Relay style cursor connection. */
export interface PageInfo {
  /** When paginating forwards, are there more items?*/
  hasNextPage: boolean;
  /** When paginating backwards, are there more items?*/
  hasPreviousPage: boolean;
  /** The cursor to continue paginating backwards.*/
  startCursor: Maybe<string>;
  /** The cursor to continue paginating forwards.*/
  endCursor: Maybe<string>;
  /** Total number of nodes in the paginated connection.*/
  total: number;
  /** Number of nodes in the current page.*/
  count: number;
  /** Index of the current page.*/
  currentPage: number;
  /** Index of the last available page.*/
  lastPage: number;
}

/** An edge that contains a node of type Classroom and a cursor. */
export interface ClassroomEdge {
  /** The Classroom node.*/
  node: Classroom;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Classroom {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  user: User;
  classtype: Classtype;
  school: School;
  users: User[];
  notifications: Maybe<Notification[]>;
  assigments: Maybe<AssigmentConnection>;
  meetings: Maybe<MeetingConnection>;
  exams: Maybe<ExamConnection>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  cover: Maybe<Document>;
  username: string;
  address: Maybe<string>;
  phone: string;
  nisn: Maybe<string>;
  roles: Roles;
  metadata: Maybe<UserMetadata>;
  balance: Maybe<number>;
  access: Maybe<string[]>;
  is_admin: boolean;
  province: Province;
  city: City;
  district: District;
  school: Maybe<School>;
  is_bimbel: boolean;
  is_bimbel_active: boolean;
  absents: Absent[];
  absentreceivers: Absent[];
  agendas: Agenda[];
  assigments: Assigment[];
  assigmentsubmissions: Assigmentsubmission[];
  attendances: Attendance[];
  documents: Document[];
  chats: Chat[];
  chatrooms: Chatroom[];
  mychatrooms: Chatroom[];
  participantchatrooms: Chatroom[];
  myclassrooms: Classroom[];
  consultants: Consultation[];
  courses: Course[];
  examplays: Examplay[];
  formsubmissions: Formsubmission[];
  questions: Question[];
  Packagequestions: Packagequestion[];
  quizzez: Quiz[];
  quizplays: Quizplay[];
  myreports: Report[];
  reports: Report[];
  mytransactions: Transaction[];
  transactions: Transaction[];
  mytutorings: Tutoring[];
  tutorings: Tutoring[];
  childrens: User[];
  withdraws: Withdraw[];
  classrooms: Classroom[];
  examsupervising: Exam[];
  subjects: Subject[];
  acceses: Access[];
  schools: School[];
  followers: User[];
  reqfollowers: User[];
  followings: User[];
  reqfollowings: User[];
}

export interface Document {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  roles: Maybe<string>;
  path: string;
  type: string;
  compressed: boolean;
  documentable: Maybe<Documentable>;
  documentable_id: string;
  documentable_type: Maybe<string>;
  metadata: Maybe<DocumentMetadata>;
}

export type Documentable = Question | Meeting | Assigmentsubmission | Assigment | Formsubmission;
export interface Question {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  subject: Subject;
  classtype: Classtype;
  metadata: Maybe<QuestionMetadata>;
  visibility: Visibility;
  documents: Maybe<Document[]>;
  exams: Exam[];
  quizzez: Quiz[];
}

export interface Subject {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  abbreviation: Maybe<string>;
  description: Maybe<string>;
  type: SubjectType;
  quizzez: Maybe<QuizConnection>;
  questions: Maybe<QuestionConnection>;
  Packagequestions: Maybe<PackagequestionConnection>;
  assigments: Maybe<AssigmentConnection>;
}

export enum SubjectType {
  General = 'GENERAL',
  Vocational = 'VOCATIONAL',
  Local_content = 'LOCAL_CONTENT',
  Special_development = 'SPECIAL_DEVELOPMENT',
}
/** A paginated list of Quiz edges. */
export interface QuizConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Quiz edges.*/
  edges: QuizEdge[];
}

/** An edge that contains a node of type Quiz and a cursor. */
export interface QuizEdge {
  /** The Quiz node.*/
  node: Quiz;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Quiz {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  user: User;
  classtype: Classtype;
  subject: Subject;
  metadata: Maybe<QuizMetadata>;
  played_count: number;
  is_rewarded: boolean;
  difficulty: QuizDifficulty;
  visibility: Visibility;
  cover: Maybe<Document>;
  transaction: Maybe<Transaction>;
  questions: Question[];
  quizplays: Maybe<QuizplayConnection>;
}

export interface QuizMetadata {
  time_limit: number;
  description: number;
}

export enum QuizDifficulty {
  Easy = 'EASY',
  Medium = 'MEDIUM',
  Hard = 'HARD',
}
export enum Visibility {
  Publik = 'PUBLIK',
  Select = 'SELECT',
  Privat = 'PRIVAT',
}
export interface Transaction {
  id: string;
  created_at: string;
  updated_at: string;
  uuid: string;
  user: User;
  to: Maybe<User>;
  amount: number;
  tax: number;
  discount: number;
  paid: boolean;
  payment_url: Maybe<string>;
  voucher: Maybe<Voucher>;
  status: TransactionStatus;
  payment_method: string;
  transactionable: Maybe<Transactionable>;
  transactionable_id: Maybe<string>;
  transactionable_type: Maybe<string>;
}

export interface Voucher {
  id: string;
  created_at: string;
  updated_at: string;
  code: string;
  name: string;
  percentage: number;
  expired_at: string;
  metadata: Maybe<VoucherMetadata>;
  transactions: Maybe<TransactionConnection>;
}

export interface VoucherMetadata {
  description: string;
}

/** A paginated list of Transaction edges. */
export interface TransactionConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Transaction edges.*/
  edges: TransactionEdge[];
}

/** An edge that contains a node of type Transaction and a cursor. */
export interface TransactionEdge {
  /** The Transaction node.*/
  node: Transaction;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export enum TransactionStatus {
  Pending = 'PENDING',
}
export type Transactionable = Access | Quiz;
export interface Access {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: Maybe<string>;
  ability: string[];
  roles: Maybe<Roles>;
  price: number;
  users: User[];
  transactions: Maybe<Transaction[]>;
}

export enum Roles {
  Student = 'STUDENT',
  Teacher = 'TEACHER',
  Guardian = 'GUARDIAN',
  Ppdb = 'PPDB',
  School_admin = 'SCHOOL_ADMIN',
  General = 'GENERAL',
}
/** A paginated list of Quizplay edges. */
export interface QuizplayConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Quizplay edges.*/
  edges: QuizplayEdge[];
}

/** An edge that contains a node of type Quizplay and a cursor. */
export interface QuizplayEdge {
  /** The Quizplay node.*/
  node: Quizplay;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Quizplay {
  id: string;
  created_at: string;
  updated_at: string;
  quiz: Quiz;
  user: User;
  quizsession: Quizsession;
  start_at: Maybe<string>;
  finish_at: Maybe<string>;
  grade: number;
  graded: boolean;
  answers_map: Maybe<AnswerMap[]>;
}

export interface Quizsession {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  user: User;
  quiz: Quiz;
  password: Maybe<string>;
  start_at: Maybe<string>;
  finish_at: Maybe<string>;
  chatroom: Chatroom;
  quizplays: Maybe<QuizplayConnection>;
}

export interface Chatroom {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  second: User;
  metadata: Maybe<ChatroomMetadata>;
  chatroomable: Maybe<Chatroomable>;
  chatroomable_id: Maybe<string>;
  chatroomable_type: Maybe<string>;
  chats: Maybe<ChatConnection>;
}

export interface ChatroomMetadata {
  is_active: boolean;
}

export type Chatroomable = Meeting | Quizsession | Tutoring;
export interface Meeting {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  uuid: string;
  metadata: Maybe<MeetingMetadata>;
  classroom: Classroom;
  finish_at: string;
  open_at: string;
  documents: Maybe<Document[]>;
  chatrooms: Maybe<Chatroom[]>;
}

export interface MeetingMetadata {
  attachment_id: Maybe<string>;
  attachment_type: Maybe<string>;
  description: string;
  media: Maybe<MeetingMedia>;
  content_type: Maybe<MeetingContentType>;
  content: Maybe<string>;
}

export enum MeetingMedia {
  Youtube = 'YOUTUBE',
  Picture = 'PICTURE',
  Audio = 'AUDIO',
  Video = 'VIDEO',
  Document = 'DOCUMENT',
}
export enum MeetingContentType {
  Draw = 'DRAW',
}
export interface Tutoring {
  id: string;
  user: User;
  tutor: User;
  start_at: string;
  finish_at: string;
  metadata: Maybe<TutoringMetadata>;
  rate: number;
  is_approved: boolean;
  status: TutoringStatus;
  agenda: Agenda;
  chatroom: Chatroom;
}

export interface TutoringMetadata {
  address: string;
  notes: Maybe<string>;
  reject_reason: Maybe<string>;
  geolocation: string;
}

export enum TutoringStatus {
  Pending = 'PENDING',
}
export interface Agenda {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user: User;
  uuid: string;
  agendaable: Maybe<Agendaable>;
  agendaable_id: Maybe<string>;
  agendaable_type: Maybe<string>;
  metadata: Maybe<AgendaMetadata>;
  start_at: string;
  finish_at: string;
  attendances: Attendance[];
}

export type Agendaable = Meeting | Examsession | Tutoring;
export interface Examsession {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  exam: Exam;
  open_at: string;
  close_at: string;
  agenda: Agenda;
  token: string;
  examplays: Maybe<ExamplayConnection>;
}

export interface Exam {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  subject: Subject;
  examtype: Examtype;
  classroom: Classroom;
  metadata: Maybe<ExamMetadata>;
  is_odd_semester: boolean;
  examplaysCount: number;
  hint: string;
  description: string;
  time_limit: number;
  year_start: number;
  year_end: number;
  shuffle: boolean;
  show_result: boolean;
  examplays: Examplay[];
  examsessions: Examsession[];
  supervisors: User[];
  questions: Question[];
}

export interface Examtype {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  examplays: Maybe<ExamConnection>;
}

/** A paginated list of Exam edges. */
export interface ExamConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Exam edges.*/
  edges: ExamEdge[];
}

/** An edge that contains a node of type Exam and a cursor. */
export interface ExamEdge {
  /** The Exam node.*/
  node: Exam;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface ExamMetadata {
  description: Maybe<string>;
}

export interface Examplay {
  id: string;
  created_at: string;
  updated_at: string;
  exam: Exam;
  examsession: Examsession;
  user: User;
  last_activity: Maybe<string>;
  minute_passed: Maybe<number>;
  start_at: Maybe<string>;
  finish_at: Maybe<string>;
  grade: Maybe<number>;
  graded: Maybe<boolean>;
  answers_map: Maybe<AnswerMap[]>;
}

export interface AnswerMap {
  comment: Maybe<string>;
  grade: Maybe<number>;
  question: Maybe<QuestionCopy>;
  answer: Maybe<Answer>;
}

export interface QuestionCopy {
  id: string;
  created_at: string;
  updated_at: string;
  subject: Maybe<Subject>;
  classtype: Maybe<Classtype>;
  metadata: Maybe<QuestionMetadata>;
  documents: Maybe<Document[]>;
}

export interface QuestionMetadata {
  type: QuestionType;
  uuid: string;
  content: string;
  answers: Answer[];
  correctanswer: string;
}

export enum QuestionType {
  Multi_choice = 'MULTI_CHOICE',
  Essay = 'ESSAY',
  Filler = 'FILLER',
}
export interface Answer {
  uuid: string;
  content: Maybe<string>;
  attachment: Maybe<string>;
  attachment_type: Maybe<string>;
}

/** A paginated list of Examplay edges. */
export interface ExamplayConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Examplay edges.*/
  edges: ExamplayEdge[];
}

/** An edge that contains a node of type Examplay and a cursor. */
export interface ExamplayEdge {
  /** The Examplay node.*/
  node: Examplay;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface AgendaMetadata {
  reason: Maybe<string>;
  description: Maybe<string>;
}

export interface Attendance {
  id: string;
  created_at: string;
  updated_at: string;
  absent: Maybe<Absent>;
  agenda: Agenda;
  user: User;
  attended: boolean;
  is_bimbel: boolean;
  date: string;
}

export interface Absent {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  receiver: User;
  metadata: Maybe<AbsentMetadata>;
  start_at: string;
  finish_at: string;
}

export interface AbsentMetadata {
  reason: Maybe<string>;
  description: Maybe<string>;
}

/** A paginated list of Chat edges. */
export interface ChatConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Chat edges.*/
  edges: ChatEdge[];
}

/** An edge that contains a node of type Chat and a cursor. */
export interface ChatEdge {
  /** The Chat node.*/
  node: Chat;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Chat {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  chatroom: Chatroom;
  metadata: Maybe<ChatMetadata>;
}

export interface ChatMetadata {
  content: string;
}

/** A paginated list of Question edges. */
export interface QuestionConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Question edges.*/
  edges: QuestionEdge[];
}

/** An edge that contains a node of type Question and a cursor. */
export interface QuestionEdge {
  /** The Question node.*/
  node: Question;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Packagequestion edges. */
export interface PackagequestionConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Packagequestion edges.*/
  edges: PackagequestionEdge[];
}

/** An edge that contains a node of type Packagequestion and a cursor. */
export interface PackagequestionEdge {
  /** The Packagequestion node.*/
  node: Packagequestion;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Packagequestion {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  subject: Subject;
  classtype: Classtype;
  metadata: Maybe<PackagequestionMetadata>;
  visibility: Visibility;
  name: string;
  questions: Question[];
  examplequestions: Question[];
  questionsCount: number;
}

export interface PackagequestionMetadata {
  description: Maybe<string>;
}

/** A paginated list of Assigment edges. */
export interface AssigmentConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Assigment edges.*/
  edges: AssigmentEdge[];
}

/** An edge that contains a node of type Assigment and a cursor. */
export interface AssigmentEdge {
  /** The Assigment node.*/
  node: Assigment;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Assigment {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  user: User;
  classroom: Classroom;
  subject: Subject;
  metadata: Maybe<AssigmentMetadata>;
  close_at: string;
  is_odd_semester: boolean;
  assigmentsubmissions: Assigmentsubmission[];
  myassigmentsubmission: Maybe<Assigmentsubmission>;
  documents: Maybe<Document[]>;
}

export interface AssigmentMetadata {
  description: string;
}

export interface Assigmentsubmission {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  assigment: Assigment;
  grade: number;
  graded: boolean;
  edited_times: number;
  turned_at: string;
  turned: boolean;
  documents: Maybe<Document[]>;
}

export interface Formsubmission {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  submission: Submission;
  metadata: Maybe<FormsubmissionMetadata>;
  documents: Maybe<Document[]>;
}

export interface Submission {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  school: Maybe<School>;
  max_submission: number;
  is_paid: boolean;
  price: number;
  open_at: string;
  close_at: string;
}

export interface School {
  id: string;
  created_at: string;
  updated_at: string;
  cover: Maybe<Document>;
  name: string;
  npsn: string;
  province: Province;
  city: City;
  district: District;
  metadata: Maybe<SchoolMetadata>;
  classrooms: Classroom[];
  submissions: Submission[];
  students: User[];
  majors: Major[];
  extracurriculars: Extracurricular[];
  teachers: User[];
  homerooms: User[];
  administrators: User[];
  counselors: User[];
  headmaster: Maybe<User>;
}

export interface Province {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  cities: Maybe<CityConnection>;
  schools: Maybe<SchoolConnection>;
  users: Maybe<UserConnection>;
}

/** A paginated list of City edges. */
export interface CityConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of City edges.*/
  edges: CityEdge[];
}

/** An edge that contains a node of type City and a cursor. */
export interface CityEdge {
  /** The City node.*/
  node: City;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface City {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  type: Maybe<string>;
  province: Province;
  districts: Maybe<DistrictConnection>;
  users: Maybe<UserConnection>;
}

/** A paginated list of District edges. */
export interface DistrictConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of District edges.*/
  edges: DistrictEdge[];
}

/** An edge that contains a node of type District and a cursor. */
export interface DistrictEdge {
  /** The District node.*/
  node: District;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface District {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  city: City;
  users: Maybe<UserConnection>;
  schools: Maybe<SchoolConnection>;
}

/** A paginated list of User edges. */
export interface UserConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of User edges.*/
  edges: UserEdge[];
}

/** An edge that contains a node of type User and a cursor. */
export interface UserEdge {
  /** The User node.*/
  node: User;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of School edges. */
export interface SchoolConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of School edges.*/
  edges: SchoolEdge[];
}

/** An edge that contains a node of type School and a cursor. */
export interface SchoolEdge {
  /** The School node.*/
  node: School;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface SchoolMetadata {
  description: Maybe<string>;
}

export interface Major {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  abbreviation: Maybe<string>;
  description: Maybe<string>;
  type: Maybe<string>;
  schools: School[];
}

export interface Extracurricular {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  abbreviation: Maybe<string>;
  description: Maybe<string>;
  type: Maybe<string>;
  schools: School[];
}

export interface FormsubmissionMetadata {
  content: string;
  type: string;
}

export interface DocumentMetadata {
  original_name: string;
  duration: number;
  original: number;
  compressed: number;
  type: Maybe<string>;
}

export interface UserMetadata {
  identity: Maybe<Identity>;
  description_bimbel: Maybe<string>;
  specialty: Maybe<string>;
  degree: Maybe<string>;
}

export interface Identity {
  national_card_number: Maybe<string>;
  family_card_number: Maybe<string>;
}

export interface Consultation {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  consultant: User;
  name: string;
  metadata: Maybe<ConsultationMetadata>;
}

export interface ConsultationMetadata {
  note: Maybe<string>;
  advice: Maybe<string>;
  problem: Maybe<string>;
}

export interface Course {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  views: number;
  access: string[];
  user: User;
  metadata: Maybe<CourseMetadata>;
  classtype: Classtype;
  subject: Subject;
}

export interface CourseMetadata {
  description: string;
}

export interface Report {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  receiver: User;
  name: string;
  metadata: Maybe<ReportMetadata>;
  type: ReportType;
  rejected_reason: Maybe<string>;
  status: ReportStatus;
}

export interface ReportMetadata {
  name: Maybe<string>;
  content: Maybe<string>;
  data: Maybe<string>;
}

export enum ReportType {
  Grade = 'GRADE',
  Add_subject = 'ADD_SUBJECT',
  Content_violation = 'CONTENT_VIOLATION',
  Parent_call = 'PARENT_CALL',
}
export enum ReportStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Approved = 'APPROVED',
}
export interface Withdraw {
  id: string;
  created_at: string;
  updated_at: string;
  uuid: string;
  user: User;
  amount: number;
  tax: number;
  paid: boolean;
  status: WithdrawStatus;
  metadata: Maybe<WithdrawMetadata>;
}

export enum WithdrawStatus {
  Pending = 'PENDING',
}
export interface WithdrawMetadata {
  content: Maybe<string>;
}

export interface Notification {
  type: Maybe<string>;
  notifiable_type: Maybe<string>;
  notifiable_id: string;
  data: Maybe<BasicNotification>;
  read_at: Maybe<string>;
  id: string;
  created_at: string;
  updated_at: string;
}

export interface BasicNotification {
  id: Maybe<string>;
  name: Maybe<string>;
  type: Maybe<string>;
  message: Maybe<string>;
  definition: Maybe<string>;
  picture: Maybe<Document>;
  start_at: Maybe<string>;
  finish_at: Maybe<string>;
}

/** A paginated list of Meeting edges. */
export interface MeetingConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Meeting edges.*/
  edges: MeetingEdge[];
}

/** An edge that contains a node of type Meeting and a cursor. */
export interface MeetingEdge {
  /** The Meeting node.*/
  node: Meeting;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Announcement {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  type: string;
  roles: string;
  cover: Maybe<Document>;
  user: User;
  school: Maybe<School>;
  metadata: Maybe<AnnouncementMetadata>;
}

export interface AnnouncementMetadata {
  content: Maybe<string>;
}

/** A paginated list of Announcement edges. */
export interface AnnouncementConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Announcement edges.*/
  edges: AnnouncementEdge[];
}

/** An edge that contains a node of type Announcement and a cursor. */
export interface AnnouncementEdge {
  /** The Announcement node.*/
  node: Announcement;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Province edges. */
export interface ProvinceConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Province edges.*/
  edges: ProvinceEdge[];
}

/** An edge that contains a node of type Province and a cursor. */
export interface ProvinceEdge {
  /** The Province node.*/
  node: Province;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Subject edges. */
export interface SubjectConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Subject edges.*/
  edges: SubjectEdge[];
}

/** An edge that contains a node of type Subject and a cursor. */
export interface SubjectEdge {
  /** The Subject node.*/
  node: Subject;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Assigmentsubmission edges. */
export interface AssigmentsubmissionConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Assigmentsubmission edges.*/
  edges: AssigmentsubmissionEdge[];
}

/** An edge that contains a node of type Assigmentsubmission and a cursor. */
export interface AssigmentsubmissionEdge {
  /** The Assigmentsubmission node.*/
  node: Assigmentsubmission;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Classtype edges. */
export interface ClasstypeConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Classtype edges.*/
  edges: ClasstypeEdge[];
}

/** An edge that contains a node of type Classtype and a cursor. */
export interface ClasstypeEdge {
  /** The Classtype node.*/
  node: Classtype;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Examsession edges. */
export interface ExamsessionConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Examsession edges.*/
  edges: ExamsessionEdge[];
}

/** An edge that contains a node of type Examsession and a cursor. */
export interface ExamsessionEdge {
  /** The Examsession node.*/
  node: Examsession;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Report edges. */
export interface ReportConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Report edges.*/
  edges: ReportEdge[];
}

/** An edge that contains a node of type Report and a cursor. */
export interface ReportEdge {
  /** The Report node.*/
  node: Report;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Quizsession edges. */
export interface QuizsessionConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Quizsession edges.*/
  edges: QuizsessionEdge[];
}

/** An edge that contains a node of type Quizsession and a cursor. */
export interface QuizsessionEdge {
  /** The Quizsession node.*/
  node: Quizsession;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Consultation edges. */
export interface ConsultationConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Consultation edges.*/
  edges: ConsultationEdge[];
}

/** An edge that contains a node of type Consultation and a cursor. */
export interface ConsultationEdge {
  /** The Consultation node.*/
  node: Consultation;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Absent edges. */
export interface AbsentConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Absent edges.*/
  edges: AbsentEdge[];
}

/** An edge that contains a node of type Absent and a cursor. */
export interface AbsentEdge {
  /** The Absent node.*/
  node: Absent;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Attendance edges. */
export interface AttendanceConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Attendance edges.*/
  edges: AttendanceEdge[];
}

/** An edge that contains a node of type Attendance and a cursor. */
export interface AttendanceEdge {
  /** The Attendance node.*/
  node: Attendance;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Agenda edges. */
export interface AgendaConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Agenda edges.*/
  edges: AgendaEdge[];
}

/** An edge that contains a node of type Agenda and a cursor. */
export interface AgendaEdge {
  /** The Agenda node.*/
  node: Agenda;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Withdraw edges. */
export interface WithdrawConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Withdraw edges.*/
  edges: WithdrawEdge[];
}

/** An edge that contains a node of type Withdraw and a cursor. */
export interface WithdrawEdge {
  /** The Withdraw node.*/
  node: Withdraw;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Chatroom edges. */
export interface ChatroomConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Chatroom edges.*/
  edges: ChatroomEdge[];
}

/** An edge that contains a node of type Chatroom and a cursor. */
export interface ChatroomEdge {
  /** The Chatroom node.*/
  node: Chatroom;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Voucher edges. */
export interface VoucherConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Voucher edges.*/
  edges: VoucherEdge[];
}

/** An edge that contains a node of type Voucher and a cursor. */
export interface VoucherEdge {
  /** The Voucher node.*/
  node: Voucher;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Submission edges. */
export interface SubmissionConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Submission edges.*/
  edges: SubmissionEdge[];
}

/** An edge that contains a node of type Submission and a cursor. */
export interface SubmissionEdge {
  /** The Submission node.*/
  node: Submission;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Course edges. */
export interface CourseConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Course edges.*/
  edges: CourseEdge[];
}

/** An edge that contains a node of type Course and a cursor. */
export interface CourseEdge {
  /** The Course node.*/
  node: Course;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Document edges. */
export interface DocumentConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Document edges.*/
  edges: DocumentEdge[];
}

/** An edge that contains a node of type Document and a cursor. */
export interface DocumentEdge {
  /** The Document node.*/
  node: Document;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Major edges. */
export interface MajorConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Major edges.*/
  edges: MajorEdge[];
}

/** An edge that contains a node of type Major and a cursor. */
export interface MajorEdge {
  /** The Major node.*/
  node: Major;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Extracurricular edges. */
export interface ExtracurricularConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Extracurricular edges.*/
  edges: ExtracurricularEdge[];
}

/** An edge that contains a node of type Extracurricular and a cursor. */
export interface ExtracurricularEdge {
  /** The Extracurricular node.*/
  node: Extracurricular;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Examtype edges. */
export interface ExamtypeConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Examtype edges.*/
  edges: ExamtypeEdge[];
}

/** An edge that contains a node of type Examtype and a cursor. */
export interface ExamtypeEdge {
  /** The Examtype node.*/
  node: Examtype;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Access edges. */
export interface AccessConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Access edges.*/
  edges: AccessEdge[];
}

/** An edge that contains a node of type Access and a cursor. */
export interface AccessEdge {
  /** The Access node.*/
  node: Access;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthOutput {
  user: Maybe<User>;
  token: Maybe<string>;
  message: Maybe<string>;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface GenericOutput {
  status: Maybe<boolean>;
  message: Maybe<string>;
}

export enum ExamplayReportType {
  Beat = 'BEAT',
  Finish = 'FINISH',
  Save = 'SAVE',
}
export interface ExamplayGenericOutput {
  status: Maybe<boolean>;
  message: Maybe<string>;
  examplay: Maybe<Examplay>;
}

export interface UpdatePasswordInput {
  password: string;
  new_password: string;
}

export interface InviteQuizsession {
  user_id: string;
  quizsession_id: string;
}

export interface TutoringRequest {
  user_id: string;
  finish_at: string;
  start_at: string;
  metadata: string;
}

export interface TutoringRequestOutput {
  status: Maybe<boolean>;
  message: Maybe<string>;
  tutoring: Maybe<Tutoring>;
  transaction: Maybe<Transaction>;
}

export interface AccessRequest {
  access_id: string;
}

export interface AccessRequestOutput {
  status: Maybe<boolean>;
  message: Maybe<string>;
  transaction: Maybe<Transaction>;
}

export interface CreateUser {
  name: string;
  username: string;
  email: string;
  password: string;
  gender?: string;
  province_id: string;
  city_id: string;
  district_id: string;
  phone: string;
  roles: string;
  nisn?: string;
  is_bimbel?: boolean;
  is_bimbel_active?: boolean;
}

export interface CreateProvince {
  name: string;
}

export interface CreateCity {
  name: string;
  province_id: string;
}

export interface CreateDistrict {
  name: string;
  city_id: string;
}

export interface CreateClassroom {
  name: string;
  school_id: string;
  classtype_id: string;
}

export interface CreateSubject {
  name: string;
  abbreviation?: string;
  description?: string;
  type?: SubjectType;
}

export interface CreateExam {
  name: string;
  examtype_id: string;
  classroom_id: string;
  subject_id: string;
  metadata?: string;
  is_odd_semester?: boolean;
  hint?: string;
  description?: string;
  time_limit: number;
  year_start: number;
  year_end: number;
  shuffle?: boolean;
  show_result?: boolean;
  examsessions: CreateExamsessionHasMany;
  supervisors?: ConnectSupervisorBelongsToMany;
  questions: ConnectQuestionBelongsToMany;
}

export interface CreateExamsessionHasMany {
  create: CreateExamsessionMany[];
}

export interface CreateExamsessionMany {
  name: string;
  token?: string;
  open_at?: string;
  close_at?: string;
}

export interface ConnectSupervisorBelongsToMany {
  connect?: string[];
}

export interface ConnectQuestionBelongsToMany {
  connect: string[];
}

export interface CreateExamsession {
  name: string;
  exam_id: string;
  token?: string;
  open_at?: string;
  close_at?: string;
}

export interface CreateExamplay {
  exam_id: string;
  examsession_id: string;
  start_at: string;
  answers_map?: string;
}

export interface CreateAssigment {
  name: string;
  classroom_id: string;
  subject_id: string;
  is_odd_semester?: boolean;
  metadata?: string;
  close_at: string;
  documents?: BasicOneToMany;
}

export interface BasicOneToMany {
  delete?: string[];
  connect?: string[];
  disconnect?: string[];
}

export interface CreateClasstype {
  level: number;
}

export interface CreateMeeting {
  name: string;
  uuid: string;
  classroom_id: string;
  metadata?: string;
  open_at: string;
  finish_at: string;
}

export interface CreateReport {
  name: string;
  receiver_id: string;
  metadata?: string;
  type: ReportType;
}

export interface CreateReportAdmin {
  name: string;
  receiver_id: string;
  metadata?: string;
  type: ReportType;
}

export interface CreateQuiz {
  subject_id: string;
  metadata?: string;
  difficulty: QuizDifficulty;
  visibility: Visibility;
}

export interface CreateQuizsession {
  quiz_id: string;
  password: string;
}

export interface JoinQuizsession {
  password: string;
}

export interface CreateQuizPlay {
  quiz_id: string;
  quizsession_id: string;
}

export interface CreateConsultation {
  consultant_id: string;
  name: string;
  school_id: string;
  metadata?: string;
}

export interface CreateAbsent {
  receiver_id: string;
  name: string;
  metadata?: string;
  start_at: string;
  finish_at: string;
}

export interface CreateAgenda {
  agendaable_id?: string;
  agendaable_type?: string;
  uuid: string;
  name: string;
  metadata?: string;
  start_at: string;
  finish_at: string;
}

export interface CreatePackagequestion {
  subject_id: string;
  classtype_id: string;
  name: string;
  questions?: CreatePackagequestionBelongsToMany;
  metadata?: string;
}

export interface CreatePackagequestionBelongsToMany {
  connect?: string[];
  create: CreateQuestion[];
}

export interface CreateQuestion {
  subject_id: string;
  classtype_id: string;
  metadata?: string;
  visibility: Visibility;
}

export interface CreateChat {
  chatrooms_id: string;
  metadata?: string;
}

export interface CreateVoucher {
  name: string;
  code: string;
  percentage: number;
  metadata?: string;
  expired_at: string;
}

export interface CreateFormsubmission {
  metadata?: string;
  submission_id: string;
}

export interface CreateSubmission {
  name: string;
  school_id?: string;
  max_submission: number;
  is_paid?: boolean;
  price?: number;
  open_at: string;
  close_at?: string;
}

export interface CreateCourse {
  name: string;
  access?: string[];
  classtype_id: string;
  subject_id: string;
  metadata?: string;
}

export interface CreateMajor {
  name: string;
  description?: string;
  abbreviation?: string;
  type?: string;
}

export interface CreateExtracurricular {
  name?: string;
  description?: string;
  abbreviation?: string;
  type?: string;
}

export interface CreateAnnouncement {
  name?: string;
  type?: string;
  roles?: string;
  metadata: string;
}

export interface UpdateUser {
  name?: string;
  username?: string;
  email?: string;
  address?: string;
  password?: string;
  gender?: string;
  province_id?: string;
  city_id?: string;
  is_admin?: boolean;
  district_id?: string;
  phone?: string;
  roles?: Roles;
  nisn?: string;
  is_bimbel?: boolean;
  is_bimbel_active?: boolean;
}

export interface UpdateQuizplay {
  grade: number;
  answers_map?: string;
  graded?: boolean;
  start_at?: string;
  finish_at?: string;
}

/** UPDATE */
export interface UpdateProvince {
  name: string;
}

export interface UpdateCity {
  name: string;
  province_id: string;
}

export interface UpdateDistrict {
  name: string;
  city_id: string;
}

export interface UpdateClassroom {
  name: string;
  classtype_id: string;
}

export interface UpdateSubject {
  name?: string;
  abbreviation?: string;
  description?: string;
  type?: SubjectType;
}

export interface UpdateExam {
  name?: string;
  examtype_id?: string;
  metadata?: string;
  is_odd_semester: boolean;
  hint?: string;
  description?: string;
  time_limit?: number;
  year_start?: number;
  year_end?: number;
  shuffle?: boolean;
  show_result?: boolean;
  examsessions?: UpdateExamsessionHasMany;
  supervisors?: UpdateConnectSupervisorBelongsToMany;
  questions?: UpdateConnectQuestionBelongsToMany;
}

export interface UpdateExamsessionHasMany {
  create?: CreateExamsession[];
}

export interface UpdateConnectSupervisorBelongsToMany {
  sync?: string[];
}

export interface UpdateConnectQuestionBelongsToMany {
  sync: string[];
}

export interface UpdateExamplay {
  last_activity?: string;
  minute_passed?: number;
  start_at?: string;
  finish_at?: string;
  grade?: number;
  graded?: boolean;
  answers_map?: string;
}

export interface UpdateExamsession {
  name?: string;
  exam_id?: string;
  token?: string;
  open_at?: string;
  close_at?: string;
}

export interface UpdateAssigment {
  name?: string;
  subject_id: string;
  is_odd_semester: boolean;
  metadata?: string;
  close_at: string;
  documents?: BasicOneToMany;
}

export interface UpdateClasstype {
  level: number;
}

export interface UpdateMeeting {
  name?: string;
  metadata?: string;
  open_at?: string;
  finish_at?: string;
}

export interface UpdateReport {
  name?: string;
  status?: ReportStatus;
  rejected_reason?: string;
  metadata?: string;
}

export interface UpdateQuiz {
  subject_id: string;
  metadata?: string;
  difficulty: QuizDifficulty;
  visibility: Visibility;
}

export interface UpdateQuizsession {
  password?: string;
  start_at?: string;
  finish_at?: string;
}

export interface UpdateConsultation {
  name?: string;
  metadata?: string;
}

export interface UpdateAbsent {
  name?: string;
  metadata?: string;
}

export interface UpdateAgenda {
  name?: string;
  metadata?: string;
  start_at: string;
  finish_at: string;
}

export interface UpdatePackagequestion {
  subject_id: string;
  classtype_id: string;
  name?: string;
  metadata?: string;
}

export interface UpdateChat {
  chatrooms_id: string;
  metadata?: string;
}

export interface UpdateVoucher {
  name?: string;
  code: string;
  percentage: number;
  metadata?: string;
  expired_at: string;
}

export interface UpdateSubmission {
  name?: string;
  school_id?: string;
  max_submission: number;
  is_paid?: boolean;
  price?: number;
  open_at: string;
  close_at?: string;
}

export interface UpdateCourse {
  name?: string;
  access?: string[];
  classtype_id: string;
  subject_id: string;
  metadata?: string;
}

export interface UpdateMajor {
  name?: string;
  description?: string;
  abbreviation?: string;
  type?: string;
}

export interface UpdateExtracurricular {
  name?: string;
  description?: string;
  abbreviation?: string;
  type?: string;
}

export interface UpdateAssigmentsubmission {
  metadata?: string;
  turned?: boolean;
  turned_at?: string;
  graded?: boolean;
  grade?: number;
  assigment_id?: string;
  documents?: BasicOneToMany;
}

export interface UpdateAnnouncement {
  name?: string;
  type?: string;
  roles?: string;
  metadata?: string;
}

export interface AssigmentsubmissionMetadata {
  content: Maybe<string>;
  comment: Maybe<string>;
  external_url: Maybe<string>;
}

export interface Assigmentsubmissions {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  assigment: Assigment;
  grade: number;
  graded: boolean;
  edited_times: number;
  turned_at: string;
  metadata: Maybe<AssigmentsubmissionMetadata>;
  documents: Maybe<Document[]>;
}

export interface VideoMetadata {
  original_name: string;
  course_name: Maybe<string>;
  duration: number;
  original: number;
  compressed: number;
}

export type Videoable =
  | Question
  | Course
  | Meeting
  | Assigmentsubmission
  | Assigment
  | Formsubmission;
export type Pictureable =
  | Question
  | User
  | Course
  | Formsubmission
  | Meeting
  | School
  | Assigmentsubmission
  | Assigment;
export type Audioable = Question | Meeting | Assigmentsubmission | Assigment | Formsubmission;
export interface CreateAssigmentsubmission {
  assigment_id: string;
  metadata?: string;
  documents?: BasicOneToMany;
}

export interface UpsertChatroomBelongsToMany {
  connect?: string[];
  sync?: string[];
}

export interface UpsertChatroom {
  second_id: string;
  privat: boolean;
  metadata?: string;
  chatroomable_id?: string;
  chatroomable_type?: string;
  users?: UpsertChatroomBelongsToMany;
}

export interface CourseVideoMorphMany {
  connect?: string[];
}

export interface UpdatePackagequestionBelongsToMany {
  connect?: string[];
  sync?: string[];
  create?: CreateQuestion[];
}

export interface UpdateFormsubmission {
  metadata?: string;
}

export interface CreateAccess {
  name?: string;
  description?: string;
  ability: string[];
  roles?: Roles;
  price: number;
}

export interface UpdateAccess {
  name?: string;
  description?: string;
  ability: string[];
  roles?: Roles;
  price: number;
}

/** The available directions for ordering a list of records. */
export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}
/** Allows ordering a list of records. */
export interface OrderByClause {
  /** The column that is used for ordering.*/
  column: string;
  /** The direction that is used for ordering.*/
  order: SortOrder;
}

/** Information about pagination using a fully featured paginator. */
export interface PaginatorInfo {
  /** Number of items in the current page.*/
  count: number;
  /** Index of the current page.*/
  currentPage: number;
  /** Index of the first item in the current page.*/
  firstItem: Maybe<number>;
  /** Are there more pages after this one?*/
  hasMorePages: boolean;
  /** Index of the last item in the current page.*/
  lastItem: Maybe<number>;
  /** Index of the last available page.*/
  lastPage: number;
  /** Number of items per page.*/
  perPage: number;
  /** Number of total available items.*/
  total: number;
}

/** Information about pagination using a simple paginator. */
export interface SimplePaginatorInfo {
  /** Number of items in the current page.*/
  count: number;
  /** Index of the current page.*/
  currentPage: number;
  /** Index of the first item in the current page.*/
  firstItem: Maybe<number>;
  /** Index of the last item in the current page.*/
  lastItem: Maybe<number>;
  /** Number of items per page.*/
  perPage: number;
}

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  Only = 'ONLY',
  With = 'WITH',
  Without = 'WITHOUT',
}
export interface classtypesAllArgs {
  level?: number;
}

export interface examtypesAllArgs {}

export interface subjectsAllArgs {
  level?: number;
  user_id?: string;
}

export interface provincesAllArgs {}

export interface citiesAllArgs {
  province_id?: string;
}

export interface districtsAllArgs {
  city_id?: string;
}

export interface userArgs {
  id: string;
}

export interface userFindArgs {
  name?: string;
  username?: string;
  roles?: Roles;
  gender?: string;
  phone?: string;
  is_bimbel?: boolean;
  is_bimbel_active?: boolean;
  province_id?: string;
  city_id?: string;
  district_id?: string;
  school_id?: string;
  parent_id?: string;
}

export interface announcementArgs {
  id: string;
}

export interface questionArgs {
  id: string;
}

export interface agendaArgs {
  id: string;
}

export interface absentArgs {
  id: string;
}

export interface formsubmissionArgs {
  id: string;
}

export interface submissionArgs {
  id: string;
}

export interface attendanceArgs {
  id: string;
}

export interface tutoringArgs {
  id: string;
}

export interface extracurricularArgs {
  id: string;
}

export interface chatArgs {
  id: string;
}

export interface examplayArgs {
  id: string;
}

export interface chatroomArgs {
  id: string;
}

export interface quizplayArgs {
  id: string;
}

export interface quizsessionArgs {
  id: string;
}

export interface classroomArgs {
  id: string;
}

export interface packagequestionArgs {
  id: string;
}

export interface examtypeArgs {
  id: string;
}

export interface meetingArgs {
  id: string;
}

export interface courseArgs {
  id: string;
}

export interface consultationArgs {
  id: string;
}

export interface assigmentArgs {
  id: string;
}

export interface cityArgs {
  id: string;
}

export interface reportArgs {
  id: string;
}

export interface schoolArgs {
  id: string;
}

export interface classtypeArgs {
  id: string;
}

export interface subjectArgs {
  id: string;
}

export interface districtArgs {
  id: string;
}

export interface voucherArgs {
  id: string;
}

export interface examArgs {
  id: string;
}

export interface provinceArgs {
  id: string;
}

export interface majorArgs {
  id: string;
}

export interface quizArgs {
  id: string;
}

export interface withdrawArgs {
  id: string;
}

export interface assigmentsubmissionArgs {
  id: string;
}

export interface transactionArgs {
  id: string;
}

export interface accessArgs {
  id: string;
}

export interface documentArgs {
  id: string;
}

export interface meArgs {}

export interface notificationsArgs {}

export interface candidateclassroomsArgs {}

export interface classroomsArgs {
  name?: string;
  user_id?: string;
  student_id?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface usersArgs {
  name?: string;
  username?: string;
  roles?: Roles;
  gender?: string;
  phone?: string;
  is_bimbel?: boolean;
  is_bimbel_active?: boolean;
  province_id?: string;
  city_id?: string;
  district_id?: string;
  school_id?: string;
  parent_id?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface announcementsArgs {
  name?: string;
  roles?: string;
  school_id?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface provincesArgs {
  name?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface citiesArgs {
  province_id?: string;
  name?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface districtsArgs {
  city_id?: string;
  name?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface schoolsArgs {
  district_id?: string;
  city_id?: string;
  province_id?: string;
  teacher_id?: string;
  name?: string;
  npsn?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface subjectsArgs {
  name?: string;
  type?: SubjectType;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface examsArgs {
  name?: string;
  is_odd_semester?: boolean;
  classroom_id?: string;
  subject_id?: string;
  examtype_id?: string;
  user_id?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface assigmentsArgs {
  name?: string;
  is_odd_semester?: boolean;
  subject_id?: string;
  classroom_id?: string;
  user_id?: string;
  close_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface assigmentsubmissionsArgs {
  name?: string;
  is_odd_semester?: boolean;
  subject_id?: string;
  assigment_id?: string;
  user_id?: string;
  classroom_id?: string;
  edited_times?: number;
  turned_at?: string;
  graded?: boolean;
  grade?: number;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface classtypesArgs {
  level?: number;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface examsessionArgs {
  name?: string;
  token?: string;
  exam_id?: string;
  close_at?: string;
  open_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface examplaysArgs {
  name?: string;
  token?: string;
  exam_id?: string;
  examsession_id?: string;
  user_id?: string;
  classroom_id?: string;
  last_activity?: string;
  start_at?: string;
  finish_at?: string;
  minute_passed?: number;
  grade?: number;
  graded?: boolean;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface meetingsArgs {
  name?: string;
  classroom_id?: string;
  finish_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface reportsArgs {
  name?: string;
  user_id?: string;
  receiver_id?: string;
  type?: ReportType;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface quizzezArgs {
  name?: string;
  user_id?: string;
  subject_id?: string;
  classtype_id?: string;
  type?: Visibility;
  difficulty?: QuizDifficulty;
  is_rewarded?: boolean;
  played_count?: number;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface quizsessionsArgs {
  name?: string;
  user_id?: string;
  quiz_id?: string;
  password?: string;
  start_at?: string;
  finish_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface quizplaysArgs {
  user_id?: string;
  quizsession_id?: string;
  start_at?: string;
  finish_at?: string;
  grade: number;
  graded: boolean;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface consultationsArgs {
  name?: string;
  user_id?: string;
  consultant_id?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface absentsArgs {
  user_id?: string;
  receiver_id?: string;
  start_at?: string;
  finish_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface attendancesArgs {
  absent_id?: string;
  agenda_id?: string;
  attended?: boolean;
  is_bimbel?: boolean;
  date?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface agendasArgs {
  user_id?: string;
  name?: string;
  uuid?: string;
  classroom_id?: string;
  agendaable_id?: string;
  agendaable_type?: string;
  start_at?: string;
  finish_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface questionsArgs {
  user_id?: string;
  subject_id?: string;
  classtype_id?: string;
  visibility?: Visibility;
  finish_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface packagequestionsArgs {
  name?: string;
  user_id?: string;
  subject_id?: string;
  classtype_id?: string;
  visibility?: Visibility;
  finish_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface transactionsArgs {
  user_id?: string;
  to_id?: string;
  voucher_id?: string;
  uuid?: string;
  status?: TransactionStatus;
  paid?: boolean;
  payment_method?: string;
  transactionable_id?: string;
  transactionable_type?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface withdrawsArgs {
  user_id?: string;
  to_id?: string;
  uuid?: string;
  status?: WithdrawStatus;
  paid?: boolean;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface chatroomsArgs {
  user_id?: string;
  second_id?: string;
  uuid?: string;
  chatroomable_id?: string;
  chatroomable_type?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface chatsArgs {
  user_id?: string;
  second_id?: string;
  chatroom_id?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface vouchersArgs {
  name?: string;
  code?: string;
  percentage?: string;
  expired_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface submissionsArgs {
  name?: string;
  school_id?: string;
  max_submission?: number;
  is_paid?: boolean;
  price?: number;
  open_at?: string;
  close_at?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface coursesArgs {
  name?: string;
  user_id?: string;
  classtype_id?: string;
  subject_id?: string;
  access?: string[];
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface documentsArgs {
  name?: string;
  roles?: string;
  pictureable_id?: string;
  pictureable_type?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface majorsArgs {
  name?: string;
  abbreviation?: string;
  description?: string;
  type?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface extracurricularsArgs {
  name?: string;
  abbreviation?: string;
  description?: string;
  type?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface examtypesArgs {
  name?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface accesesArgs {
  name?: string;
  ability?: string[];
  roles?: Roles;
  price?: number;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface loginArgs {
  input: LoginInput;
}

export interface registerArgs {
  input: RegisterInput;
}

export interface deleteUserSubjectArgs {
  id: string;
}

export interface handleExamplayArgs {
  type: ExamplayReportType;
  id: string;
  answers_maps: string;
  last_activity: string;
}

export interface submitExamTokenArgs {
  examsession_id: string;
  token: string;
}

export interface handleQRAttendanceArgs {
  uuid: string;
}

export interface joinClassroomArgs {
  classroom_id: string;
}

export interface assignSubjectArgs {
  subject_id: string;
}

export interface joinSchoolArgs {
  school_id: string;
}

export interface updateUserPasswordArgs {
  input: UpdatePasswordInput;
}

export interface inviteQuizsessionArgs {
  input: InviteQuizsession;
}

export interface sendTutoringRequestArgs {
  input: TutoringRequest;
}

export interface sendAccessRequestArgs {
  input: AccessRequest;
}

export interface markReadAllArgs {}

export interface handleFollowArgs {
  accept_followers?: string[];
  decline_followers?: string[];
  remove_followers?: string[];
  remove_following?: string[];
  cancel_following?: string[];
}

export interface handleFollowRequestArgs {
  user_id: string;
}

export interface uploadDocumentArgs {
  file: File;
  documentable_id?: string;
  documentable_type?: string;
  roles?: string;
  compressed?: boolean;
  metadata?: string;
  type: string;
}

export interface createUserArgs {
  input: CreateUser;
}

export interface createProvinceArgs {
  input: CreateProvince;
}

export interface createCityArgs {
  input: CreateCity;
}

export interface createDistrictArgs {
  input: CreateDistrict;
}

export interface createClassroomArgs {
  input: CreateClassroom;
}

export interface createSubjectArgs {
  input: CreateSubject;
}

export interface createExamArgs {
  input: CreateExam;
}

export interface createExamsessionArgs {
  input: CreateExamsession;
}

export interface createExamplayArgs {
  input: CreateExamplay;
}

export interface createAssigmentArgs {
  input: CreateAssigment;
}

export interface createClasstypeArgs {
  input: CreateClasstype;
}

export interface createMeetingArgs {
  input: CreateMeeting;
}

export interface createReportArgs {
  input: CreateReport;
}

export interface createReportAdminArgs {
  input: CreateReportAdmin;
}

export interface createQuizArgs {
  input: CreateQuiz;
}

export interface createQuizsessionArgs {
  input: CreateQuizsession;
}

export interface joinQuizsessionArgs {
  input: JoinQuizsession;
}

export interface createQuizplayArgs {
  input: CreateQuizPlay;
}

export interface createConsultationArgs {
  input: CreateConsultation;
}

export interface createAbsentArgs {
  input: CreateAbsent;
}

export interface createAgendaArgs {
  input: CreateAgenda;
}

export interface createPackagequestionArgs {
  input: CreatePackagequestion;
}

export interface createChatArgs {
  input: CreateChat;
}

export interface createVoucherArgs {
  input: CreateVoucher;
}

export interface createFormsubmissionArgs {
  input: CreateFormsubmission;
}

export interface createSubmissionArgs {
  input: CreateSubmission;
}

export interface createCourseArgs {
  input: CreateCourse;
}

export interface createMajorArgs {
  input: CreateMajor;
}

export interface createExtracurricularArgs {
  input: CreateExtracurricular;
}

export interface createAnnouncementArgs {
  input: CreateAnnouncement;
}

export interface updateUserArgs {
  id: string;
  input: UpdateUser;
}

export interface updateQuizplayArgs {
  id: string;
  input: UpdateQuizplay;
}

export interface updateProvinceArgs {
  input: UpdateProvince;
}

export interface updateCityArgs {
  id: string;
  input: UpdateCity;
}

export interface updateDistrictArgs {
  id: string;
  input: UpdateDistrict;
}

export interface updateClassroomArgs {
  id: string;
  input: UpdateClassroom;
}

export interface updateSubjectArgs {
  id: string;
  input: UpdateSubject;
}

export interface updateExamArgs {
  id: string;
  input: UpdateExam;
}

export interface updateExamplayArgs {
  id: string;
  input: UpdateExamplay;
}

export interface updateExamsessionArgs {
  id: string;
  input: UpdateExamsession;
}

export interface updateAssigmentArgs {
  id: string;
  input: UpdateAssigment;
}

export interface updateClasstypeArgs {
  id: string;
  input: UpdateClasstype;
}

export interface updateMeetingArgs {
  id: string;
  input: UpdateMeeting;
}

export interface updateReportArgs {
  id: string;
  input: UpdateReport;
}

export interface updateQuizArgs {
  id: string;
  input: UpdateQuiz;
}

export interface updateQuizsessionArgs {
  id: string;
  input: UpdateQuizsession;
}

export interface updateConsultationArgs {
  id: string;
  input: UpdateConsultation;
}

export interface updateAbsentArgs {
  id: string;
  input: UpdateAbsent;
}

export interface updateAgendaArgs {
  id: string;
  input: UpdateAgenda;
}

export interface updatePackagequestionArgs {
  id: string;
  input: UpdatePackagequestion;
}

export interface updateChatArgs {
  id: string;
  input: UpdateChat;
}

export interface updateVoucherArgs {
  id: string;
  input: UpdateVoucher;
}

export interface updateSubmissionArgs {
  id: string;
  input: UpdateSubmission;
}

export interface updateCourseArgs {
  id: string;
  input: UpdateCourse;
}

export interface updateMajorArgs {
  id: string;
  input: UpdateMajor;
}

export interface updateExtracurricularArgs {
  id: string;
  input: UpdateExtracurricular;
}

export interface updateAssigmentsubmissionArgs {
  id?: string;
  input: UpdateAssigmentsubmission;
}

export interface updateAnnouncementArgs {
  id: string;
  input: UpdateAnnouncement;
}

export interface deleteQuestionArgs {
  id: string;
}

export interface deleteAgendaArgs {
  id: string;
}

export interface deleteAbsentArgs {
  id: string;
}

export interface deleteFormsubmissionArgs {
  id: string;
}

export interface deleteSubmissionArgs {
  id: string;
}

export interface deleteAttendanceArgs {
  id: string;
}

export interface deleteTutoringArgs {
  id: string;
}

export interface deleteUserArgs {
  id: string;
}

export interface deleteExtracurricularArgs {
  id: string;
}

export interface deleteChatArgs {
  id: string;
}

export interface deleteExamplayArgs {
  id: string;
}

export interface deleteChatroomArgs {
  id: string;
}

export interface deleteQuizplayArgs {
  id: string;
}

export interface deleteQuizsessionArgs {
  id: string;
}

export interface deleteClassroomArgs {
  id: string;
}

export interface deletePackagequestionArgs {
  id: string;
}

export interface deleteExamtypeArgs {
  id: string;
}

export interface deleteMeetingArgs {
  id: string;
}

export interface deleteCourseArgs {
  id: string;
}

export interface deleteConsultationArgs {
  id: string;
}

export interface deleteExamsessionArgs {
  id: string;
}

export interface deleteAssigmentArgs {
  id: string;
}

export interface deleteCityArgs {
  id: string;
}

export interface deleteReportArgs {
  id: string;
}

export interface deleteSchoolArgs {
  id: string;
}

export interface deleteClasstypeArgs {
  id: string;
}

export interface deleteSubjectArgs {
  id: string;
}

export interface deleteDistrictArgs {
  id: string;
}

export interface deleteVoucherArgs {
  id: string;
}

export interface deleteExamArgs {
  id: string;
}

export interface deleteProvinceArgs {
  id: string;
}

export interface deleteMajorArgs {
  id: string;
}

export interface deleteQuizArgs {
  id: string;
}

export interface deleteWithdrawArgs {
  id: string;
}

export interface deleteAssigmentsubmissionArgs {
  id: string;
}

export interface deleteTransactionArgs {
  id: string;
}

export interface deleteAccessArgs {
  id: string;
}

export interface deleteDocumentArgs {
  id: string;
}

export interface deleteAnnouncementArgs {
  id: string;
}
