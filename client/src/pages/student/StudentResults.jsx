import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Award,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/results/student/my-results');
        setResults(res.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch academic results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Group by semester
  const resultsBySem = results.reduce((acc, result) => {
    const sem = result.semester || '1';
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(result);
    return acc;
  }, {});

  const semesters = Object.keys(resultsBySem).sort((a, b) => Number(b) - Number(a));

  // Compute overall CGPA & Credits
  let totalCreditsEarned = 0;
  let totalWeightedPoints = 0;
  let totalDistinctions = 0;

  results.forEach((res) => {
    const credits = Number(res.course?.credits) || 3;
    const gp =
      res.gradePoints !== undefined
        ? Number(res.gradePoints)
        : res.grade === 'O'
        ? 10
        : res.grade === 'A+'
        ? 9
        : res.grade === 'A'
        ? 8
        : res.grade === 'B+'
        ? 7
        : res.grade === 'B'
        ? 6
        : res.grade === 'C'
        ? 5
        : 0;

    if (res.grade !== 'F') {
      totalCreditsEarned += credits;
    }
    if (res.grade === 'O' || res.grade === 'A+') {
      totalDistinctions += 1;
    }
    totalWeightedPoints += gp * credits;
  });

  const totalCourseCredits = results.reduce(
    (acc, r) => acc + (Number(r.course?.credits) || 3),
    0
  );

  const cgpa = totalCourseCredits > 0 ? (totalWeightedPoints / totalCourseCredits).toFixed(2) : '0.00';

  const getGradeStyle = (grade) => {
    switch (grade) {
      case 'O':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'A+':
      case 'A':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'B+':
      case 'B':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'C':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'F':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getGradePoint = (res) => {
    if (res.gradePoints !== undefined) return res.gradePoints;
    const g = res.grade;
    if (g === 'O') return 10;
    if (g === 'A+') return 9;
    if (g === 'A') return 8;
    if (g === 'B+') return 7;
    if (g === 'B') return 6;
    if (g === 'C') return 5;
    return 0;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-60"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-72 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Results & Grades</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your semester GPA, credits earned, and official marks breakdown
          </p>
        </div>

        {/* Semester Filter */}
        {semesters.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Filter Term:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="text-xs border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Overview GPA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cumulative GPA (CGPA)</p>
            <p className="text-3xl font-bold text-primary-700 mt-1.5">{cgpa} <span className="text-sm font-normal text-gray-400">/ 10</span></p>
            <p className="text-xs text-gray-500 mt-1">Across all completed terms</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-50 text-primary-700 border border-primary-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits Earned</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1.5">{totalCreditsEarned}</p>
            <p className="text-xs text-gray-500 mt-1">Out of {totalCourseCredits} attempted</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Distinctions</p>
            <p className="text-3xl font-bold text-amber-600 mt-1.5">{totalDistinctions}</p>
            <p className="text-xs text-gray-500 mt-1">O and A+ Grades secured</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Courses Evaluated</p>
            <p className="text-3xl font-bold text-gray-900 mt-1.5">{results.length}</p>
            <p className="text-xs text-gray-500 mt-1">Academic subjects</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Semester Results List */}
      {semesters.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No results published yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
            Exam and continuous evaluation results will appear here once finalized by your faculty and institution.
          </p>
        </div>
      ) : (
        semesters
          .filter((sem) => selectedSemester === 'ALL' || selectedSemester === sem)
          .map((sem) => {
            const semResults = resultsBySem[sem];
            let semCredits = 0;
            let semWeighted = 0;
            let hasBacklog = false;

            semResults.forEach((r) => {
              const cr = Number(r.course?.credits) || 3;
              const gp = getGradePoint(r);
              semCredits += cr;
              semWeighted += gp * cr;
              if (r.grade === 'F') hasBacklog = true;
            });

            const sgpa = semCredits > 0 ? (semWeighted / semCredits).toFixed(2) : '0.00';

            return (
              <div
                key={sem}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Semester Header */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                      S{sem}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Semester {sem}</h2>
                      <p className="text-xs text-gray-500">
                        {semResults[0]?.academicYear ? `Academic Year: ${semResults[0].academicYear} • ` : ''}
                        {semResults.length} subject{semResults.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-100">
                      SGPA: {sgpa}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
                      Credits: {semCredits}
                    </span>
                    {hasBacklog ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Backlog Pending
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Passed
                      </span>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/40 border-b border-gray-100">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Credits</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Internal</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">External</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total Marks</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Grade Point</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {semResults.map((res) => {
                        const gp = getGradePoint(res);
                        return (
                          <tr key={res._id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                                  {res.course?.code || '—'}
                                </span>
                                <span className="font-medium text-gray-900 text-sm">
                                  {res.course?.name || 'Subject'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5 font-medium text-gray-700">
                              {res.course?.credits || 3}
                            </td>
                            <td className="px-6 py-3.5 text-gray-600">
                              {res.internalMarks !== undefined ? res.internalMarks : '—'}
                            </td>
                            <td className="px-6 py-3.5 text-gray-600">
                              {res.externalMarks !== undefined ? res.externalMarks : '—'}
                            </td>
                            <td className="px-6 py-3.5 font-semibold text-gray-900">
                              {res.total !== undefined ? res.total : ((res.internalMarks || 0) + (res.externalMarks || 0)) || '—'}
                            </td>
                            <td className="px-6 py-3.5 font-mono font-bold text-gray-800">
                              {gp}
                            </td>
                            <td className="px-6 py-3.5">
                              <span
                                className={`inline-block font-extrabold text-xs px-2.5 py-1 rounded-md border text-center min-w-[36px] ${getGradeStyle(
                                  res.grade
                                )}`}
                              >
                                {res.grade || '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}
