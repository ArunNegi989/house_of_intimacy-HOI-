import React from 'react';
import { useForm } from 'react-hook-form';
import bannerImage from '../assets/images/pink.png';

// CSS Module styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: `url(${bannerImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    gap: '10px',
  },
  colMd6: {
    flex: '1 1 calc(50% - 1rem)',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    height: '100%',
  },
  mapCard: {
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mapTitle: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem',
  },
  address: {
    color: '#fff',
    fontSize: '20px',
    lineHeight: '1.8',
    marginBottom: '1.5rem',
  },
  mapContainer: {
    width: '100%',
    height: '450px',
    borderRadius: '15px',
    overflow: 'hidden',
    flex: 1,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1.1rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
    resize: 'vertical',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    color: 'black',
  },
  inputError: {
    borderColor: '#fc8181',
  },
  error: {
    color: '#e53e3e',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    display: 'block',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#25D366',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
};

export function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    // Format the message for WhatsApp
    const message = `*New Contact Form Submission*
    
*Name:* ${data.name}
*Email:* ${data.email}
${data.phone ? `*Phone:* ${data.phone}` : ''}
*Subject:* ${data.subject}

*Message:*
${data.message}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number (with country code, no + or spaces)
    const whatsappNumber = '8476898395';

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');

    // Reset the form
    reset();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.colMd6}>
          <div style={styles.formCard}>
            <h1 style={styles.title}>Get In Touch</h1>
            <p style={styles.subtitle}>
              We'd love to hear from you. Send us a message!
            </p>

            <div onSubmit={handleFormSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  style={{
                    ...styles.input,
                    ...(errors.name ? styles.inputError : {}),
                  }}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span style={styles.error}>{errors.name.message}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {}),
                  }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <span style={styles.error}>{errors.email.message}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  style={{
                    ...styles.input,
                    ...(errors.phone ? styles.inputError : {}),
                  }}
                  {...register('phone', {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Phone number must be 10 digits',
                    },
                  })}
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <span style={styles.error}>{errors.phone.message}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject *</label>
                <input
                  type="text"
                  style={{
                    ...styles.input,
                    ...(errors.subject ? styles.inputError : {}),
                  }}
                  {...register('subject', {
                    required: 'Subject is required',
                    minLength: {
                      value: 3,
                      message: 'Subject must be at least 3 characters',
                    },
                  })}
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <span style={styles.error}>{errors.subject.message}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message *</label>
                <textarea
                  style={{
                    ...styles.textarea,
                    ...(errors.message ? styles.inputError : {}),
                  }}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                  placeholder="Tell us more about your inquiry..."
                  rows="5"
                ></textarea>
                {errors.message && (
                  <span style={styles.error}>{errors.message.message}</span>
                )}
              </div>

              <button
                type="button"
                style={styles.submitBtn}
                onClick={handleFormSubmit}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#128C7E')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#25D366')
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>

        <div style={styles.colMd6}>
          <div style={styles.mapCard}>
            <h2 style={styles.mapTitle}>Our Location</h2>
            <p style={styles.address}>
              Vamika - H.O.I., Downtown Building
              <br />
              Near IT Park, Sahastradhara Rd
              <br />
              Dehradun, Uttarakhand 248001
            </p>
            <div style={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.0826747891847!2d78.05856731508273!3d30.352913981777235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908d61ff7f8f7c5%3A0x8e8b5e5e5e5e5e5e!2sSahastradhara%20Road%2C%20Dehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1635789123456!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '15px' }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
