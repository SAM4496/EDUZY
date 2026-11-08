require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Institute = require('../models/Institute');
const Branch = require('../models/Branch');
const Field = require('../models/Field');
const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Fee = require('../models/Fee');
const Result = require('../models/Result');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error('Error connecting to DB:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    
    // Clear all existing data
    console.log('Clearing old data...');
    await Promise.all([
      Institute.deleteMany(),
      Branch.deleteMany(),
      Field.deleteMany(),
      User.deleteMany(),
      Department.deleteMany(),
      Course.deleteMany(),
      Attendance.deleteMany(),
      Assignment.deleteMany(),
      Submission.deleteMany(),
      Fee.deleteMany(),
      Result.deleteMany()
    ]);
    console.log('Data cleared.');

    // ============================================
    // 1. CREATE INSTITUTE
    // ============================================
    console.log('Creating institute...');
    const institute = await Institute.create({
      name: 'Eduzy College of Engineering & Technology',
      code: 'ECET',
      contactEmail: 'info@eduzy.college.edu',
      contactPhone: '+91 9876543210',
      address: '123 University Road, Tech Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      isSetupComplete: true,
      isActive: true
    });
    console.log(`Institute created: ${institute.name}`);

    // ============================================
    // 2. CREATE BRANCHES
    // ============================================
    console.log('Creating branches...');
    const branchData = [
      { name: 'Main Campus', code: 'MAIN', address: '123 University Road, Pune' },
      { name: 'North Campus', code: 'NORTH', address: '45 North Avenue, Pune' },
      { name: 'City Center', code: 'CITY', address: '78 MG Road, Pune' }
    ];
    const branches = await Branch.insertMany(
      branchData.map(b => ({ ...b, institute: institute._id }))
    );
    console.log(`${branches.length} branches created.`);

    // ============================================
    // 3. CREATE FIELDS/PROGRAMS
    // ============================================
    console.log('Creating fields...');
    const fieldData = [
      { name: 'Computer Science & Engineering', code: 'CSE', type: 'engineering' },
      { name: 'Electronics & Communication', code: 'ECE', type: 'engineering' },
      { name: 'Mechanical Engineering', code: 'ME', type: 'engineering' },
      { name: 'Information Technology', code: 'IT', type: 'engineering' },
      { name: 'Computer Applications', code: 'CA', type: 'computer_science' },
      { name: 'Commerce & Business', code: 'COM', type: 'commerce' }
    ];
    const fields = await Field.insertMany(
      fieldData.map(f => ({ ...f, institute: institute._id }))
    );
    console.log(`${fields.length} fields created.`);

    // ============================================
    // 4. CREATE ADMIN USER
    // ============================================
    console.log('Creating admin...');
    const adminUser = await User.create({
      institute: institute._id,
      userId: 'ADM-2024-0001',
      name: 'Dr. Admin',
      email: 'admin@eduzy.college.edu',
      password: 'Admin@123',
      role: 'admin',
      branch: branches[0]._id,
      mustChangePassword: false
    });
    console.log(`Admin created: ${adminUser.userId} / ${adminUser.email}`);

    // ============================================
    // 5. CREATE DEPARTMENTS
    // ============================================
    console.log('Creating departments...');
    const deptData = [
      { code: 'CSE', name: 'Computer Science & Engineering' },
      { code: 'ECE', name: 'Electronics & Communication Engineering' },
      { code: 'ME', name: 'Mechanical Engineering' },
      { code: 'CE', name: 'Civil Engineering' },
      { code: 'EE', name: 'Electrical Engineering' },
      { code: 'IT', name: 'Information Technology' },
      { code: 'MATH', name: 'Mathematics' },
      { code: 'PHY', name: 'Physics' }
    ];
    const departments = await Department.insertMany(deptData);
    console.log(`${departments.length} departments created.`);

    // ============================================
    // 6. CREATE FACULTY (auto-generated IDs)
    // ============================================
    console.log('Creating faculty...');
    const defaultPassword = await bcrypt.hash('Password@123', 12);
    const facultyData = [
      { name: 'Amit Sharma', email: 'faculty1@eduzy.college.edu', dept: 0, branch: 0, field: 0 },
      { name: 'Priya Patel', email: 'faculty2@eduzy.college.edu', dept: 1, branch: 0, field: 1 },
      { name: 'Rajesh Kumar', email: 'faculty3@eduzy.college.edu', dept: 2, branch: 1, field: 2 },
      { name: 'Sneha Gupta', email: 'faculty4@eduzy.college.edu', dept: 0, branch: 0, field: 0 },
      { name: 'Vikram Singh', email: 'faculty5@eduzy.college.edu', dept: 3, branch: 1, field: 2 },
      { name: 'Ananya Reddy', email: 'faculty6@eduzy.college.edu', dept: 5, branch: 0, field: 3 },
      { name: 'Deepak Joshi', email: 'faculty7@eduzy.college.edu', dept: 4, branch: 2, field: 2 },
      { name: 'Meera Nair', email: 'faculty8@eduzy.college.edu', dept: 6, branch: 0, field: 4 },
      { name: 'Arjun Menon', email: 'faculty9@eduzy.college.edu', dept: 7, branch: 1, field: 0 },
      { name: 'Kavita Desai', email: 'faculty10@eduzy.college.edu', dept: 0, branch: 2, field: 0 }
    ];
    const createdFaculty = await User.insertMany(
      facultyData.map((f, i) => ({
        institute: institute._id,
        userId: `FAC-2024-${String(i + 1).padStart(4, '0')}`,
        name: f.name,
        email: f.email,
        password: defaultPassword,
        role: 'faculty',
        department: departments[f.dept]._id,
        branch: branches[f.branch]._id,
        field: fields[f.field]._id,
        phone: `+91 98765${String(43210 + i).padStart(5, '0')}`,
        employeeId: `EMP${String(100 + i)}`,
        mustChangePassword: true
      }))
    );
    console.log(`${createdFaculty.length} faculty created.`);

    // ============================================
    // 7. CREATE STUDENTS (auto-generated IDs)
    // ============================================
    console.log('Creating students...');
    const studentNames = [
      'Aarav Patel', 'Diya Sharma', 'Vivaan Reddy', 'Ananya Gupta', 'Arjun Singh',
      'Saanvi Kumar', 'Aditya Nair', 'Isha Joshi', 'Rohan Desai', 'Pooja Mehta',
      'Krishna Iyer', 'Shreya Pillai', 'Rahul Verma', 'Tanvi Kapoor', 'Manish Pandey',
      'Divya Bhat', 'Nikhil Saxena', 'Riya Mishra', 'Karan Malhotra', 'Neha Chauhan'
    ];
    const createdStudents = await User.insertMany(
      studentNames.map((name, i) => ({
        institute: institute._id,
        userId: `STU-2024-${String(i + 1).padStart(4, '0')}`,
        name,
        email: `student${i + 1}@eduzy.college.edu`,
        password: defaultPassword,
        role: 'student',
        department: departments[i % 6]._id,
        branch: branches[i % 3]._id,
        field: fields[i % 6]._id,
        phone: `+91 87654${String(32100 + i).padStart(5, '0')}`,
        enrollmentNo: `EN${2024}${String(i + 1).padStart(4, '0')}`,
        semester: (i % 8) + 1,
        cgpa: parseFloat((6 + Math.random() * 4).toFixed(2)),
        mustChangePassword: true
      }))
    );
    console.log(`${createdStudents.length} students created.`);

    // ============================================
    // 8. CREATE COURSES
    // ============================================
    console.log('Creating courses...');
    const courseData = [
      { code: 'CS501', name: 'Data Structures & Algorithms', dept: 0, fac: 0, credits: 4, sem: 5 },
      { code: 'CS502', name: 'Database Management Systems', dept: 0, fac: 3, credits: 4, sem: 5 },
      { code: 'CS503', name: 'Operating Systems', dept: 0, fac: 9, credits: 3, sem: 5 },
      { code: 'EC501', name: 'Digital Signal Processing', dept: 1, fac: 1, credits: 4, sem: 5 },
      { code: 'EC502', name: 'VLSI Design', dept: 1, fac: 1, credits: 3, sem: 5 },
      { code: 'ME501', name: 'Thermodynamics', dept: 2, fac: 2, credits: 4, sem: 5 },
      { code: 'ME502', name: 'Fluid Mechanics', dept: 2, fac: 4, credits: 3, sem: 5 },
      { code: 'IT501', name: 'Web Technologies', dept: 5, fac: 5, credits: 3, sem: 5 },
      { code: 'IT502', name: 'Cloud Computing', dept: 5, fac: 5, credits: 3, sem: 5 },
      { code: 'EE501', name: 'Power Systems', dept: 4, fac: 6, credits: 4, sem: 5 },
      { code: 'MA501', name: 'Engineering Mathematics III', dept: 6, fac: 7, credits: 3, sem: 5 },
      { code: 'PH501', name: 'Applied Physics', dept: 7, fac: 8, credits: 3, sem: 5 }
    ];
    const createdCourses = await Course.insertMany(
      courseData.map(c => ({
        code: c.code,
        name: c.name,
        department: departments[c.dept]._id,
        faculty: createdFaculty[c.fac]._id,
        credits: c.credits,
        semester: c.sem
      }))
    );
    console.log(`${createdCourses.length} courses created.`);

    // ============================================
    // 9. CREATE ATTENDANCE (last 30 days)
    // ============================================
    console.log('Creating attendance records...');
    let attendanceRecords = [];
    const today = new Date();
    for (const course of createdCourses) {
      const courseStudents = createdStudents.filter(
        s => s.department.toString() === course.department.toString()
      );
      for (let day = 1; day <= 21; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - day);
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        for (const student of courseStudents) {
          attendanceRecords.push({
            course: course._id,
            student: student._id,
            faculty: course.faculty,
            date: date,
            status: Math.random() > 0.2 ? 'present' : 'absent'
          });
        }
      }
    }
    if (attendanceRecords.length > 0) {
      await Attendance.insertMany(attendanceRecords);
    }
    console.log(`${attendanceRecords.length} attendance records created.`);

    // ============================================
    // 10. CREATE ASSIGNMENTS
    // ============================================
    console.log('Creating assignments...');
    const assignmentData = [
      { title: 'Binary Search Tree Implementation', course: 0, fac: 0, points: 100, days: 14 },
      { title: 'ER Diagram Design', course: 1, fac: 3, points: 50, days: 7 },
      { title: 'Process Scheduling Simulation', course: 2, fac: 9, points: 80, days: 10 },
      { title: 'DSP Filter Design', course: 3, fac: 1, points: 100, days: 14 },
      { title: 'Heat Transfer Analysis', course: 5, fac: 2, points: 60, days: 7 },
      { title: 'REST API Development', course: 7, fac: 5, points: 100, days: 14 }
    ];
    const createdAssignments = await Assignment.insertMany(
      assignmentData.map(a => {
        const due = new Date(today);
        due.setDate(due.getDate() + a.days);
        return {
          title: a.title,
          course: createdCourses[a.course]._id,
          faculty: createdFaculty[a.fac]._id,
          description: `Complete the ${a.title} assignment.`,
          dueDate: due,
          totalPoints: a.points,
          weightage: 10
        };
      })
    );
    console.log(`${createdAssignments.length} assignments created.`);

    // ============================================
    // 11. CREATE SUBMISSIONS
    // ============================================
    console.log('Creating submissions...');
    const submissions = [];
    for (const assignment of createdAssignments) {
      const course = createdCourses.find(c => c._id.toString() === assignment.course.toString());
      const courseStudents = createdStudents.filter(
        s => s.department.toString() === course.department.toString()
      );
      for (const student of courseStudents.slice(0, 3)) {
        submissions.push({
          assignment: assignment._id,
          student: student._id,
          status: 'submitted',
          submittedAt: new Date()
        });
      }
    }
    if (submissions.length > 0) {
      await Submission.insertMany(submissions);
    }
    console.log(`${submissions.length} submissions created.`);

    // ============================================
    // 12. CREATE FEE RECORDS
    // ============================================
    console.log('Creating fee records...');
    const feeRecords = createdStudents.map(student => ({
      student: student._id,
      semester: student.semester || 5,
      academicYear: '2024-25',
      tuition: 50000,
      lab: 8000,
      library: 2000,
      sports: 2000,
      exam: 3000,
      total: 65000,
      paid: Math.random() > 0.3 ? 65000 : Math.floor(Math.random() * 40000),
      dueDate: new Date('2025-01-15')
    }));
    await Fee.insertMany(feeRecords);
    console.log(`${feeRecords.length} fee records created.`);

    // ============================================
    // 13. CREATE RESULTS
    // ============================================
    console.log('Creating results...');
    const results = [];
    for (const course of createdCourses) {
      const courseStudents = createdStudents.filter(
        s => s.department.toString() === course.department.toString()
      );
      for (const student of courseStudents) {
        const internal = Math.floor(20 + Math.random() * 20);
        const external = Math.floor(30 + Math.random() * 40);
        results.push({
          student: student._id,
          course: course._id,
          semester: 5,
          academicYear: '2024-25',
          internalMarks: internal,
          externalMarks: external
        });
      }
    }
    if (results.length > 0) {
      await Result.insertMany(results);
    }
    console.log(`${results.length} results created.`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n========================================');
    console.log('✅ SEED COMPLETE!');
    console.log('========================================');
    console.log(`Institute:   ${institute.name} (${institute.code})`);
    console.log(`Branches:    ${branches.length}`);
    console.log(`Fields:      ${fields.length}`);
    console.log(`Departments: ${departments.length}`);
    console.log(`Admin:       ${adminUser.email} / Admin@123 (ID: ${adminUser.userId})`);
    console.log(`Faculty:     ${createdFaculty.length} (Password: Password@123)`);
    console.log(`Students:    ${createdStudents.length} (Password: Password@123)`);
    console.log(`Courses:     ${createdCourses.length}`);
    console.log(`Attendance:  ${attendanceRecords.length}`);
    console.log(`Assignments: ${createdAssignments.length}`);
    console.log(`Submissions: ${submissions.length}`);
    console.log(`Fees:        ${feeRecords.length}`);
    console.log(`Results:     ${results.length}`);
    console.log('========================================\n');
    console.log('Login credentials:');
    console.log('  Admin:   admin@eduzy.college.edu / Admin@123');
    console.log('  Faculty: faculty1@eduzy.college.edu / Password@123');
    console.log('  Student: student1@eduzy.college.edu / Password@123');
    console.log('  (Or use userId: ADM-2024-0001, FAC-2024-0001, STU-2024-0001)\n');

    process.exit();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

importData();
