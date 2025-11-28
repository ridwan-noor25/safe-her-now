/**
 * Multi-step Report form component
 * Wizard-style form with progress indicator for submitting harassment reports
 */
import { useState, FormEvent, ChangeEvent } from 'react';
import { reportsAPI, uploadAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, FileText, Tag, Link as LinkIcon, Send, MapPin, Calendar, 
  AlertTriangle, Phone, Mail, UserCheck, UserX, Upload, X, Clock, 
  TrendingUp, Eye, EyeOff, Users as UsersIcon, ChevronRight, ChevronLeft, CheckCircle2
} from 'lucide-react';

interface ReportFormProps {
  onSuccess?: () => void;
}

interface FileAttachment {
  name: string;
  type: string;
  url: string;
  size: number;
  uploaded_at: string;
}

const ReportForm = ({ onSuccess }: ReportFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'online',
    subcategory: '',
    tags: [] as string[],
    location: '',
    incident_date: '',
    severity: 'medium',
    urgency: 'normal',
    evidence: '',
    contact_phone: '',
    preferred_contact_method: 'email',
    follow_up_requested: false,
    witnesses: '',
    perpetrator_info: '',
    anonymous_report: false,
    related_report_ids: [] as number[],
  });
  
  const [fileAttachments, setFileAttachments] = useState<FileAttachment[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: 'online', label: 'Online Harassment', subcategories: ['Social Media', 'Email', 'Messaging', 'Dating App', 'Other'] },
    { value: 'physical', label: 'Physical Harassment', subcategories: ['Public Place', 'Workplace', 'School', 'Transportation', 'Other'] },
    { value: 'workplace', label: 'Workplace Harassment', subcategories: ['Verbal', 'Physical', 'Sexual', 'Discrimination', 'Other'] },
    { value: 'other', label: 'Other', subcategories: [] },
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Incident Details', icon: MapPin },
    { id: 3, title: 'Evidence', icon: LinkIcon },
    { id: 4, title: 'Contact', icon: Phone },
    { id: 5, title: 'Additional Info', icon: UsersIcon },
  ];

  const totalSteps = steps.length;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await uploadAPI.uploadFile(file);
        setFileAttachments(prev => [...prev, response.data.file]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFileAttachments(fileAttachments.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.category);
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      case 5:
        return true; // Optional fields
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        file_attachments: fileAttachments,
        incident_date: formData.incident_date || undefined,
      };
      
      await reportsAPI.create(submitData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'online',
        subcategory: '',
        tags: [],
        location: '',
        incident_date: '',
        severity: 'medium',
        urgency: 'normal',
        evidence: '',
        contact_phone: '',
        preferred_contact_method: 'email',
        follow_up_requested: false,
        witnesses: '',
        perpetrator_info: '',
        anonymous_report: false,
        related_report_ids: [],
      });
      setFileAttachments([]);
      setTagInput('');
      setShowForm(false);
      setCurrentStep(1);
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(c => c.value === formData.category);
  const progressPercentage = (currentStep / totalSteps) * 100;

  // If form is not shown, display the initial button
  if (!showForm) {
    return (
      <Card className="border-0 shadow-lg-custom bg-card animate-fade-up">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">Submit a Report</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Report an incident of harassment. Our multi-step form will guide you through the process.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-lg h-12 px-8 text-base font-medium"
              size="lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Start Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg-custom bg-card animate-fade-up">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-display">Submit New Report</CardTitle>
              <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setCurrentStep(1);
              }}
              className="rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-primary border-primary text-white'
                            : isActive
                            ? 'bg-primary border-primary text-white shadow-glow scale-110'
                            : 'bg-background border-border text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                        isCompleted ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Progress Range */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-center text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Report Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief title describing the incident"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {currentCategory && currentCategory.subcategories.length > 0 && (
                  <div className="space-y-2">
                    <label htmlFor="subcategory" className="text-sm font-medium text-foreground">
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                      value={formData.subcategory}
                      onChange={handleChange}
                    >
                      <option value="">Select subcategory</option>
                      {currentCategory.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the incident..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tags (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" className="rounded-lg">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Incident Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where did the incident occur?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="incident_date" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Incident Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="incident_date"
                    name="incident_date"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    value={formData.incident_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="severity" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Severity
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    value={formData.severity}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="urgency" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    value={formData.urgency}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="immediate">Immediate</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Evidence */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <label htmlFor="evidence" className="text-sm font-medium text-foreground">
                  Evidence Links/Notes
                </label>
                <textarea
                  id="evidence"
                  name="evidence"
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                  value={formData.evidence}
                  onChange={handleChange}
                  placeholder="Links to screenshots, files, or other evidence"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  File Attachments
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx,video/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-muted-foreground">
                  Upload images, PDFs, documents, or videos (max 10MB per file)
                </p>
                
                {fileAttachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {fileAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Contact & Follow-up */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact_phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="preferred_contact_method" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Preferred Contact Method
                  </label>
                  <select
                    id="preferred_contact_method"
                    name="preferred_contact_method"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    value={formData.preferred_contact_method}
                    onChange={handleChange}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <input
                  type="checkbox"
                  id="follow_up_requested"
                  name="follow_up_requested"
                  checked={formData.follow_up_requested}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="follow_up_requested" className="text-sm font-medium text-foreground">
                  I would like to receive follow-up on this report
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Additional Information */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <label htmlFor="witnesses" className="text-sm font-medium text-foreground">
                  Witnesses (Optional)
                </label>
                <textarea
                  id="witnesses"
                  name="witnesses"
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                  value={formData.witnesses}
                  onChange={handleChange}
                  placeholder="Names and contact information of any witnesses..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="perpetrator_info" className="text-sm font-medium text-foreground">
                  Perpetrator Information (Optional)
                </label>
                <textarea
                  id="perpetrator_info"
                  name="perpetrator_info"
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                  value={formData.perpetrator_info}
                  onChange={handleChange}
                  placeholder="Information about the perpetrator if known..."
                />
              </div>

              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <input
                  type="checkbox"
                  id="anonymous_report"
                  name="anonymous_report"
                  checked={formData.anonymous_report}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="anonymous_report" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  Submit as anonymous report (your identity will be hidden from moderators)
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="rounded-lg"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-lg"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || uploading}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-lg"
              >
                {loading ? (
                  'Submitting...'
                ) : uploading ? (
                  'Uploading files...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
