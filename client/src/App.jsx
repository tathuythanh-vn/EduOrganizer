import { Navigate, Route, Routes } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import SignInPage from './components/SignInPage/SignInPage'
import SignUpPage from './components/SignUpPage/SignUpPage'
import ErrorPage from './components/ErrorPage/ErrorPage'
import HomePage from './components/Home/HomePage';
import ServicePage from './components/Home/ServicePage';
import AboutPage from './components/Home/AboutPage';
import OurTeamsPage from './components/Home/OurTeamsPage';
import ContactPage from './components/Home/ContactPage';
import HomePageLayout from './layouts/HomePageLayout'
import SignUpInLayout from './layouts/SignUpInLayout';
import AdminPage from './components/AdminPage/AdminPage'
import AccountPage from './components/AccountInfo/AccountPage.jsx'
import { ToastContainer } from 'react-toastify';

// Layout
import AdminPageLayout from './layouts/AdminPageLayout';
import TeacherPageLayout from './layouts/TeacherPageLayout';
import StudentPageLayout from './layouts/StudentPageLayout';

// Admin
import StudentsManagePage from './components/AdminPage/StudentsManagePage/StudentsManagePage';
import TeachersManagePage from './components/AdminPage/TeachersManagePage/TeachersManagePage';
import SubjectsManagePage from './components/AdminPage/SubjectsManagePage/SubjectsManagePage';
import OutputCriteriaManagePage from './components/AdminPage/OutputCriteriaManagePage/OutputCriteriaManagePage';
import StatisticsPage from './components/AdminPage/StatisticsPage/StatisticsPage';
import DetailClassroom from './components/AdminPage/SubjectsManagePage/components/DetailClassroom';
import ActiveTeacher from './components/AdminPage/ActiveTeacher/ActiveTeacher';

import DomainKnowledge from './components/AdminPage/DomainKnowledge/DomainKnowledge';
import DomainField from './components/AdminPage/DomainField/DomainField';
import AdminAccountPage from './components/AdminPage/AdminAccount';
import ApprovalCertificate from './components/AdminPage/Certificate/ApprovalCertificate';
import ExpiredCertificate from './components/AdminPage/Certificate/ExpiredCertificate';

import AwardStudent from './components/AdminPage/AwardStudent/AwardStudent';
import ApprovalAward from './components/AdminPage/AwardStudent/Approval/ApprovalAward.jsx';

//Modal
import AddClassroom from './components/AdminPage/SubjectsManagePage/components/AddClassroom';
import DeleteClassroom from './components/AdminPage/SubjectsManagePage/components/DeleteClassroom';
import EditClassroom from './components/AdminPage/SubjectsManagePage/components/EditClassroom';

import AddStudent from './components/AdminPage/SubjectsManagePage/components/AddStudent';
import DeleteStudent from './components/AdminPage/SubjectsManagePage/components/DeleteStudent';
import EditStudent from './components/AdminPage/SubjectsManagePage/components/EditStudent';

import AddStudentInManagePage from './components/AdminPage/StudentsManagePage/AddStudent';

import SetActive from './components/AdminPage/ActiveTeacher/SetActive';

import AddAward from './components/AdminPage/AwardStudent/AddAward';
import EditAward from './components/AdminPage/AwardStudent/EditAward';
import DeleteAward from './components/AdminPage/AwardStudent/DeleteAward';
import AddStudentToAward from './components/AdminPage/AwardStudent/AddStudentToAward';
import DeleteStudentToAward from './components/AdminPage/AwardStudent/DeleteStudentToAward';

import AddTeacher from './components/AdminPage/TeachersManagePage/AddTeacher';
import DeleteTeacher from './components/AdminPage/TeachersManagePage/DeleteTeacher';
import EditTeacher from './components/AdminPage/TeachersManagePage/EditTeacher';

import AddSubject from './components/AdminPage/SubjectsManagePage/components/AddSubject';
import DeleteSubject from './components/AdminPage/SubjectsManagePage/components/DeleteSubject';
import EditSubject from './components/AdminPage/SubjectsManagePage/components/EditSubject';
import EditSubjectLevelInLO from './components/AdminPage/SubjectsManagePage/components/EditSubjectLevelInLO';

import AddCriteria from './components/AdminPage/OutputCriteriaManagePage/AddCriteria';
import DeleteCriteria from './components/AdminPage/OutputCriteriaManagePage/DeleteCriteria';
import EditCriteria from './components/AdminPage/OutputCriteriaManagePage/EditCriteria';
import AddSubjectInCriteria from './components/AdminPage/OutputCriteriaManagePage/AddSubjectInCriteria'
import DeleteSubjectInCriteria from './components/AdminPage/OutputCriteriaManagePage/DeleteSubjectInCriteria'
import EditSubjectInCriteria from './components/AdminPage/OutputCriteriaManagePage/EditSubjectInCriteria'

import AddKnowledge from './components/AdminPage/DomainKnowledge/AddDN';
import EditKnowledge from './components/AdminPage/DomainKnowledge/EditDN';
import DeleteKnowledge from './components/AdminPage/DomainKnowledge/DeleteDN';

import AddDomainField from './components/AdminPage/DomainField/AddDF';
import EditDomainField from './components/AdminPage/DomainField/EditDF';
import DeleteDomainField from './components/AdminPage/DomainField/DeleteDF';

import Certificate from './components/AdminPage/Certificate/Certificate';
import AddCertificate from './components/AdminPage/Certificate/AddCertificate';
import EditCertificate from './components/AdminPage/Certificate/EditCertificate';


// Student 
import StudentPage from './components/StudentPage/StudentPage'
import LearningResults from './components/StudentPage/LearningResults/LearningResults'
import StudentLearningOutcome from './components/StudentPage/LearningOutcome/LearningOutcome'
import StudentAccount from './components/StudentPage/StudentAccount';
import Award from './components/StudentPage/Award/Award';
import StudentDomainField from './components/StudentPage/DomainField/DomainField';
import StudentCertificate from './components/StudentPage/Certificate/Certificate';
import StudentAddCertificate from './components/StudentPage/Certificate/AddCertificate';
import StudentEditCertificate from './components/StudentPage/Certificate/EditCertificate';

// Teacher
import TeacherPage from './components/TeacherPage/TeacherPage'
import ProtectedRouteUser from './components/ProtectedRoute/ProtectedRouteUser';
import Statistics from './components/TeacherPage/Statistics/Statistics';
import CourseDetail from './components/TeacherPage/CourseDetail';
import EditPoint from './components/TeacherPage/EditPoint';
import TeacherAccount from './components/TeacherPage/TeacherAccount';
import CodeVerifyPage from './components/CodeVerifyPage/CodeVerifyPage';
import ForgotPasswordPage from './components/ForgotPasswordPage/ForgotPasswordPage';
import StudentGraduate from './components/StudentPage/Graduate/Graduate';

function App() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const userType = localStorage.getItem('userType');

    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route element={<HomePageLayout />}>
                    <Route path='' element={<HomePage />} />
                    <Route path='home' element={<HomePage />} />
                    <Route path='service' element={<ServicePage />} />
                    <Route path='about' element={<AboutPage />} />
                    <Route path='ourteams' element={<OurTeamsPage />} />
                    <Route path='contact' element={<ContactPage />} />
                </Route>

                <Route element={<SignUpInLayout />}>
                    <Route path='signin' element={<SignInPage />} />
                    <Route path='verify-code' element={<CodeVerifyPage />} />
                    <Route path='signup' element={<SignUpPage />} />
                    <Route path='forgot-password' element={<ForgotPasswordPage />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<StudentPageLayout />}>
                    <Route path='student' element={<StudentPage />}></Route>
                    <Route path='student/results' element={<LearningResults />} />
                    <Route path='student/outcome' element={<StudentLearningOutcome />} />
                    <Route path='student/award' element={<Award />} />
                    <Route path='student/account/:accountID' element={<AccountPage />} />
                    <Route path='student/domainfield' element={<StudentDomainField />} />
                    <Route path='student/certificate' element={<StudentCertificate />} />
                    <Route path='student/graduate' element={<StudentGraduate />} />
                </Route>

                <Route element={<TeacherPageLayout />}>
                    <Route path='teacher' element={<TeacherPage />}> </Route>
                    <Route path='/teacher/coursedetail/:courseID' element={<CourseDetail />} />
                    <Route path='/teacher/statistics' element={<Statistics />} />
                    <Route path='teacher/editpoint/:studentID' element={<EditPoint />} />
                    <Route path='teacher/account/:accountID' element={<AccountPage />} />
                </Route>

                <Route path='admin' element={<AdminPageLayout />}>
                    <Route path='statistics' element={<Statistics />} />
                    <Route path='students' element={<StudentsManagePage />} />
                    <Route path='teachers' element={<TeachersManagePage />} />
                    <Route path='subjects' element={<SubjectsManagePage />} />
                    <Route path='learningoutcome' element={<OutputCriteriaManagePage />} />
                    <Route path='detailclassroom/:courseID' element={<DetailClassroom />} />
                    <Route path='accountadmin' element={<AccountPage />} />
                    <Route path='activeteacher' element={<ActiveTeacher />} />
                    <Route path='domainknowledge' element={<DomainKnowledge />} />
                    <Route path='domainfield' element={<DomainField />} />
                    <Route path='certificate' element={<Certificate />} />
                    <Route path='cerapproval' element={<ApprovalCertificate />} />
                    <Route path='cerexpired' element={<ExpiredCertificate />} />

                    <Route path='awardstudent' element={<AwardStudent />} />
                    <Route path='approvalaward' element={<ApprovalAward />} />
                </Route>

                {/* Student modals */}
                <Route path='student/certificate/addcertificate' element={<StudentAddCertificate />} />
                <Route path='student/certificate/editcertificate' element={<StudentEditCertificate />} />


                {/* Admin modals */}
                {/* <Route path='admin/subjects/addclassroom' element={<AddClassroom />} />
                <Route path='admin/subjects/deleteclassroom' element={<DeleteClassroom />} />
                <Route path='admin/subjects/editclassroom' element={<EditClassroom />} />

                <Route path='admin/students/addstudent' element={<AddStudentInManagePage />} />

                <Route path='admin/activeteacher/setactive' element={<SetActive />} />

                <Route path='admin/awardstudent/addaward' element={<AddAward />} />
                <Route path='admin/awardstudent/editaward' element={<EditAward />} />
                <Route path='admin/awardstudent/deleteaward' element={<DeleteAward />} />
                <Route path='admin/awardstudent/addstudent' element={<AddStudentToAward />} />
                <Route path='admin/awardstudent/deletestudent' element={<DeleteStudentToAward />} />

                <Route path='admin/teachers/addteacher' element={<AddTeacher />} />
                <Route path='admin/teachers/editteacher' element={<EditTeacher />} />
                <Route path='admin/teachers/deleteteacher' element={<DeleteTeacher />} />

                <Route path='admin/subjects/addstudent' element={<AddStudent />} />
                <Route path='admin/subjects/deletestudent' element={<DeleteStudent />} />
                <Route path='admin/subjects/editstudent' element={<EditStudent />} />

                <Route path='admin/subjects/addsubject' element={<AddSubject />} />
                <Route path='admin/subjects/deletesubject' element={<DeleteSubject />} />
                <Route path='admin/subjects/editsubject' element={<EditSubject />} />
                <Route path='admin/subjects/editsubjectlevel' element={<EditSubjectLevelInLO />} />

                <Route path='admin/outputcriteria/addcriteria' element={<AddSubject />} />
                <Route path='admin/outputcriteria/deletecriteria' element={<DeleteCriteria />} />
                <Route path='admin/outputcriteria/editcriteria' element={<EditCriteria />} />
                <Route path='admin/outputcriteria/addsubject' element={<AddSubjectInCriteria />} />
                <Route path='admin/outputcriteria/deletesubject' element={<DeleteSubjectInCriteria />} />
                <Route path='admin/outputcriteria/editsubject' element={<EditSubjectInCriteria />} />

                <Route path='admin/domainknowledge/adddn' element={<AddKnowledge />} />
                <Route path='admin/domainknowledge/editdn' element={<EditKnowledge />} />
                <Route path='admin/domainknowledge/deletedn' element={<DeleteKnowledge />} />

                <Route path='admin/domainfield/adddf' element={<AddDomainField />} />
                <Route path='admin/domainfield/editdf' element={<EditDomainField />} />
                <Route path='admin/domainfield/deletedf' element={<DeleteDomainField />} />

                <Route path='admin/certificate/addcertificate' element={<AddCertificate />} />
                <Route path='admin/certificate/editcertificate' element={<EditCertificate />} /> */}

                {/* Catch-all route for undefined paths */}
                <Route path='*' element={<ErrorPage />} />
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

        </>


    );
}

export default App;