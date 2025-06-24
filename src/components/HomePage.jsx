import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, BookOpen, Users, Building, TrendingUp, Calculator, BookMarked } from 'lucide-react'

const HomePage = () => {
  const [rollNumber, setRollNumber] = useState('')
  const [exam, setExam] = useState('diploma-engineering')
  const [regulation, setRegulation] = useState('2022')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!rollNumber || rollNumber.length !== 6) {
      alert('Please enter a valid 6-digit roll number')
      return
    }

    setIsLoading(true)
    
    // Navigate to result page
    navigate(`/result/${rollNumber}`)
  }

  const navigationItems = [
    { name: 'Individual Results', icon: Search, color: 'bg-blue-500', active: true },
    { name: 'Group Results', icon: Users, color: 'bg-orange-500' },
    { name: 'Institute Results', icon: Building, color: 'bg-purple-500' },
    { name: 'Latest Results', icon: TrendingUp, color: 'bg-pink-500' },
    { name: 'Point Results', icon: BookOpen, color: 'bg-green-500', badge: 'New' },
  ]

  const sidebarItems = [
    { name: 'Individual Results', color: 'border-l-blue-500' },
    { name: 'Group Results', color: 'border-l-pink-500' },
    { name: 'Institute Results', color: 'border-l-purple-500' },
    { name: 'Latest Results', color: 'border-l-orange-500' },
    { name: 'Point Results', color: 'border-l-green-500' },
    { name: 'CGPA Calculator', color: 'border-l-red-500' },
    { name: 'Booklists', color: 'border-l-blue-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-xl font-bold text-green-400">BTEB Results Ⓟ</h1>
            <div className="hidden md:flex space-x-1">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative">
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`${item.color} text-white hover:bg-opacity-80 relative`}
                    size="sm"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Search Form */}
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Individual Results</h2>
                
                <Card className="p-6">
                  <form onSubmit={handleSearch} className="space-y-6">
                    {/* Exam Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="exam" className="text-sm font-medium">Exam</Label>
                      <Select value={exam} onValueChange={setExam}>
                        <SelectTrigger className="w-full border-2 border-blue-200 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diploma-engineering">Diploma In Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Regulation Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="regulation" className="text-sm font-medium">Regulation</Label>
                      <Select value={regulation} onValueChange={setRegulation}>
                        <SelectTrigger className="w-full border-2 border-green-200 focus:border-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2016">2016</SelectItem>
                          <SelectItem value="2010">2010</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Roll Number Input */}
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber" className="text-sm font-medium">Roll Number *</Label>
                      <Input
                        id="rollNumber"
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="Enter 6-digit roll number"
                        maxLength={6}
                        className="w-full border-2 border-orange-200 focus:border-orange-500 text-lg py-3"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Searching...' : 'View Result'}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Illustration */}
              <div className="lg:w-1/2 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Your Results</h3>
                    <p className="text-gray-600">Enter your roll number to view your semester results and GPA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="mt-12 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Individual's Results (Explained)</h3>
                <p className="text-gray-600 leading-relaxed">
                  Individual result in this app refers to all the semester results of a single diploma/polytechnic student 
                  published by the Bangladesh Technical Education Board(BTEB)
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Roll Number</h3>
                <p className="text-gray-600 leading-relaxed">
                  The roll number is the 6-digit number on your admit card or registration card.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">The Exam Options</h3>
                <p className="text-gray-600 leading-relaxed">
                  The exam name option refers to the curriculum name of your diploma or polytechnic exam under the 
                  Bangladesh Technical Education Board (BTEB). By default "Diploma In Engineering" is selected. 
                  So if your exam is different from the default, make sure you select the right exam name before 
                  you hit the "View Result" button.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pages You May Visit</h3>
              <div className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <div key={index} className={`border-l-4 ${item.color} pl-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors`}>
                    <span className="text-gray-700 hover:text-gray-900">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
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

export default HomePage

