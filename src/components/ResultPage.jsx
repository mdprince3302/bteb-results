import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Share2, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { API_BASE_URL } from '../config'

const ResultPage = () => {
  const { rollNumber } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchResult()
  }, [rollNumber])

  const fetchResult = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/result/${rollNumber}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Failed to fetch result')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const calculateCGPA = (gpas) => {
    const validGpas = Object.values(gpas).filter(gpa => gpa !== null && gpa !== undefined)
    if (validGpas.length === 0) return 0
    return (validGpas.reduce((sum, gpa) => sum + gpa, 0) / validGpas.length).toFixed(2)
  }

  const getGradeFromGPA = (gpa) => {
    if (gpa === null || gpa === undefined) return { grade: 'F', color: 'bg-red-500' }
    if (gpa >= 4.0) return { grade: 'A+', color: 'bg-green-600' }
    if (gpa >= 3.5) return { grade: 'A', color: 'bg-green-500' }
    if (gpa >= 3.0) return { grade: 'A-', color: 'bg-green-400' }
    if (gpa >= 2.5) return { grade: 'B+', color: 'bg-yellow-500' }
    if (gpa >= 2.0) return { grade: 'B', color: 'bg-yellow-400' }
    return { grade: 'F', color: 'bg-red-500' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading result...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gray-800 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <Link to="/" className="text-xl font-bold text-green-400">BTEB Results Ⓟ</Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Result Not Found</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="space-x-4">
                  <Button onClick={() => navigate('/')} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Search
                  </Button>
                  <Button onClick={fetchResult}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const cgpa = calculateCGPA(result.gpas)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="text-xl font-bold text-green-400">BTEB Results Ⓟ</Link>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>

          {/* Student Info Header */}
          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Roll Number: {result.roll_number}</CardTitle>
                  <p className="text-blue-100 mt-1">Diploma In Engineering (2022 Regulation)</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{cgpa}</div>
                  <div className="text-sm text-blue-100">CGPA</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Semester Results */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Semester Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.gpas).map(([semester, gpa]) => {
                  const semesterNum = semester.replace('gpa', '')
                  const gradeInfo = getGradeFromGPA(gpa)
                  
                  return (
                    <div key={semester} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {semesterNum === '1' ? '1st' : 
                           semesterNum === '2' ? '2nd' : 
                           semesterNum === '3' ? '3rd' : 
                           `${semesterNum}th`} Semester
                        </h3>
                        <Badge className={`${gradeInfo.color} text-white`}>
                          {gradeInfo.grade}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {gpa !== null ? gpa.toFixed(2) : 'Ref'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {gpa !== null ? 'Passed' : 'Referred'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Referred Subjects */}
          {result.referred_subjects && result.referred_subjects.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Referred Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.referred_subjects.map((subject, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <span className="text-red-800 font-medium">{subject}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You need to clear these referred subjects to get your complete result.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Result Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{cgpa}</div>
                  <div className="text-sm text-gray-500">Overall CGPA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Object.values(result.gpas).filter(gpa => gpa !== null).length}
                  </div>
                  <div className="text-sm text-gray-500">Semesters Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {result.referred_subjects ? result.referred_subjects.length : 0}
                  </div>
                  <div className="text-sm text-gray-500">Referred Subjects</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Date */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Result published on: {new Date(result.created_at).toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Developed by <a href="https://www.facebook.com/mdprince3302" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-400 hover:text-green-300 transition-colors">MD Prince</a></p>
        </div>
      </footer>
    </div>
  )
}

export default ResultPage

