import { Users, FileText, GraduationCap, Award } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: '50,000+',
    label: 'Active Students',
    description: 'Students using our platform',
  },
  {
    icon: FileText,
    number: '15,000+',
    label: 'Study Documents',
    description: 'High-quality study materials',
  },
  {
    icon: GraduationCap,
    number: '500+',
    label: 'Universities',
    description: 'Institutions represented',
  },
  {
    icon: Award,
    number: '95%',
    label: 'Success Rate',
    description: 'Students improve their grades',
  },
]

export function StudyStats() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trusted by Students Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our community of successful students and start achieving better grades today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                {/* Icon Circle */}
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md`}
                  style={{
                    backgroundColor: `hsl(${200 + index * 10}, 70%, 40%)`, // subtle variation
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Numbers */}
                <div className="text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-muted-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
