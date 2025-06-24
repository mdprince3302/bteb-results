import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { API_BASE_URL } from '../config'

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setIsLoggedIn(true)
        setUploadStatus({ type: 'success', message: 'Login successful!' })
      } else {
        setUploadStatus({ type: 'error', message: data.error || 'Login failed' })
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error. Please try again.' })
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadStatus({ type: 'error', message: 'Please select a PDF file only.' })
        return
      }
      if (file.size > 16 * 1024 * 1024) { // 16MB limit
        setUploadStatus({ type: 'error', message: 'File size must be less than 16MB.' })
        return
      }
      setSelectedFile(file)
      setUploadStatus(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ type: 'error', message: 'Please select a file first.' })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (response.ok && data.success) {
        setUploadStatus({
          type: 'success',
          message: `Upload successful! Processed ${data.stats.total_students} students (${data.stats.new_records} new, ${data.stats.updated_records} updated).`,
          details: data.stats
        })
        setSelectedFile(null)
      } else {
        setUploadStatus({ type: 'error', message: data.error || 'Upload failed' })
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  if (!isLoggedIn) {
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
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>

                {uploadStatus && (
                  <Alert className={`mt-4 ${uploadStatus.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                    <AlertDescription className={uploadStatus.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                      {uploadStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Credentials:</strong><br />
                    Username: admin<br />
                    Password: admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="text-xl font-bold text-green-400">BTEB Results Ⓟ</Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, Admin</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsLoggedIn(false)}
                className="text-white hover:bg-gray-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link to="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload PDF Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div>
                <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                  Select PDF File
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to select a PDF file or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Maximum file size: 16MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? 'Processing...' : 'Upload and Process PDF'}
              </Button>

              {/* Status Messages */}
              {uploadStatus && (
                <Alert className={`${uploadStatus.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                  {uploadStatus.type === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription className={uploadStatus.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                    {uploadStatus.message}
                    {uploadStatus.details && (
                      <div className="mt-2 text-sm">
                        <p>Total Students: {uploadStatus.details.total_students}</p>
                        <p>New Records: {uploadStatus.details.new_records}</p>
                        <p>Updated Records: {uploadStatus.details.updated_records}</p>
                        {uploadStatus.details.errors.length > 0 && (
                          <p>Errors: {uploadStatus.details.errors.length}</p>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• PDF upload functionality is available in the local development environment</li>
                  <li>• The deployed version shows demo data for testing purposes</li>
                  <li>• Use the local environment for actual PDF processing</li>
                  <li>• Only PDF files are accepted (max 16MB)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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

export default AdminPage

