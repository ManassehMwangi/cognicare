import { Search, Download, Star, DollarSign } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Search & Browse',
    description: 'Find the study materials you need by subject, course, or university',
    step: '01',
  },
  {
    icon: Download,
    title: 'Purchase & Download',
    description: 'Buy high-quality notes and documents from verified students',
    step: '02',
  },
  {
    icon: Star,
    title: 'Study & Succeed',
    description: 'Use the materials to improve your understanding and grades',
    step: '03',
  },
  {
    icon: DollarSign,
    title: 'Sell Your Notes',
    description: 'Upload your own study materials and earn money from other students',
    step: '04',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How CogniCare Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who are already using our platform to improve their academic performance
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const bgHue = 180 + index * 10 // subtle teal/cyan variation for each step
            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  {/* Step Circle */}
                  <div
                    className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-md transition-all duration-300"
                    style={{ backgroundColor: `hsl(${bgHue}, 70%, 35%)` }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Step Number */}
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow"
                    style={{ backgroundColor: `hsl(${bgHue}, 70%, 60%)` }}
                  >
                    <span className="text-white font-bold text-sm">{step.step}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
            className="px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:brightness-110"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  )
}
