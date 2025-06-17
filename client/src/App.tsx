
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import type { CreateApplicationInput } from '../../server/src/schema';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<CreateApplicationInput>({
    name: '',
    email: '',
    company_name: '',
    project_description: '',
    desired_features: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateApplicationInput, string>>>({});

  const validateField = (field: keyof CreateApplicationInput, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name': {
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.length > 100) {
          newErrors.name = 'Name must be less than 100 characters';
        } else {
          delete newErrors.name;
        }
        break;
      }
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      }
      case 'company_name': {
        if (!value.trim()) {
          newErrors.company_name = 'Company name is required';
        } else if (value.length > 100) {
          newErrors.company_name = 'Company name must be less than 100 characters';
        } else {
          delete newErrors.company_name;
        }
        break;
      }
      case 'project_description': {
        if (!value.trim()) {
          newErrors.project_description = 'Project description is required';
        } else if (value.length < 10) {
          newErrors.project_description = 'Please provide at least 10 characters';
        } else if (value.length > 1000) {
          newErrors.project_description = 'Project description must be less than 1000 characters';
        } else {
          delete newErrors.project_description;
        }
        break;
      }
      case 'desired_features': {
        if (!value.trim()) {
          newErrors.desired_features = 'Desired features is required';
        } else if (value.length < 10) {
          newErrors.desired_features = 'Please provide at least 10 characters';
        } else if (value.length > 1000) {
          newErrors.desired_features = 'Desired features must be less than 1000 characters';
        } else {
          delete newErrors.desired_features;
        }
        break;
      }
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof CreateApplicationInput, value: string) => {
    setFormData((prev: CreateApplicationInput) => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach((key) => {
      validateField(key as keyof CreateApplicationInput, formData[key as keyof CreateApplicationInput]);
    });

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      await trpc.createApplication.mutate(formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company_name: '',
        project_description: '',
        desired_features: ''
      });
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted! 🎉</h1>
              <p className="text-lg text-slate-600 mb-6">
                Thank you for your interest in our chatbot solutions. We've received your application and will review it shortly.
              </p>
              <p className="text-slate-500 mb-8">
                Our team will get back to you within 2-3 business days to discuss your project in detail.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Submit Another Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium bg-slate-100 text-slate-700">
            🤖 AI-Powered Solutions
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Transform Your Business with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Chatbots</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join forward-thinking companies using our AI chatbot platform to enhance customer engagement, 
            streamline operations, and drive growth. Let's build something amazing together.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700">24/7 Customer Support</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700">Natural Language Processing</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700">Custom Integrations</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900">Apply for Early Access</CardTitle>
              <CardDescription className="text-slate-600">
                Tell us about your project and we'll help you build the perfect chatbot solution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="gridmd:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder="Enter your full name"
                      className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                        errors.name ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder="your@email.com"
                      className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                        errors.email ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.company_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('company_name', e.target.value)
                    }
                    placeholder="Your company name"
                    className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.company_name ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.company_name && (
                    <p className="text-sm text-red-600">{errors.company_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.project_description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('project_description', e.target.value)
                    }
                    placeholder="Describe your project, goals, and how you plan to use our chatbot solution..."
                    rows={4}
                    className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none ${
                      errors.project_description ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                  />
                  <div className="flex justify-between items-center">
                    {errors.project_description ? (
                      <p className="text-sm text-red-600">{errors.project_description}</p>
                    ) : (
                      <p className="text-sm text-slate-500">Minimum 10 characters</p>
                    )}
                    <p className="text-sm text-slate-400">
                      {formData.project_description.length}/1000
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Desired Chatbot Features <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.desired_features}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('desired_features', e.target.value)
                    }
                    placeholder="What specific features do you need? (e.g., FAQ automation, lead generation, customer support, integrations with existing systems...)"
                    rows={4}
                    className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none ${
                      errors.desired_features ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                  />
                  <div className="flex justify-between items-center">
                    {errors.desired_features ? (
                      <p className="text-sm text-red-600">{errors.desired_features}</p>
                    ) : (
                      <p className="text-sm text-slate-500">Minimum 10 characters</p>
                    )}
                    <p className="text-sm text-slate-400">
                      {formData.desired_features.length}/1000
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Application...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Submit Application</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  By submitting this form, you agree to our terms of service and privacy policy.
                  We'll contact you within 2-3 business days.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            © 2024 ChatBot Solutions. Building the future of conversational AI.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
