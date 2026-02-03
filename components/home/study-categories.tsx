import { BookOpen, FileText, GraduationCap, PenTool, ClipboardList, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  {
    icon: FileText,
    title: 'Summaries',
    description: 'Concise study summaries and key points',
    count: '2,500+',
  },
  {
    icon: BookOpen,
    title: 'Lecture Notes',
    description: 'Detailed notes from university lectures',
    count: '1,800+',
  },
  {
    icon: ClipboardList,
    title: 'Practice Exams',
    description: 'Past papers and practice questions',
    count: '950+',
  },
  {
    icon: PenTool,
    title: 'Assignments',
    description: 'Homework help and sample assignments',
    count: '1,200+',
  },
  {
    icon: GraduationCap,
    title: 'Theses',
    description: 'Research papers and thesis examples',
    count: '650+',
  },
  {
    icon: Users,
    title: 'Study Groups',
    description: 'Connect with fellow students',
    count: '300+',
  },
]

export function StudyCategories() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Download Study Documents
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download lecture notes, summaries, and practice exams to earn higher grades on your exams.
          Notes are written by students who have already been in your shoes and done that!
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon
          // Slight hue variation for icons to prevent redundancy
          const bgHue = 180 + index * 10 // teal-cyan gradient
          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-border"
            >
              <CardContent className="p-6 text-center">
                {/* Icon Circle */}
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md transition-colors group-hover:brightness-110"
                  style={{
                    backgroundColor: `hsl(${bgHue}, 70%, 35%)`,
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {category.description}
                </p>
                <span className="text-sm font-medium text-accent-foreground" style={{ color: `hsl(${bgHue}, 70%, 70%)` }}>
                  {category.count} documents
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
