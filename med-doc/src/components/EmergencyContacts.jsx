import { useState} from 'react';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);

  const emergencyServices = [
    { name: 'Emergency Services', number: '10111' },
    { name: 'Ambulance', number: '10177' },
    { name: 'Medical rescue', number: '0800-111-990' },
    { name: 'Rescue service (aviation)', number: '083-1999' }
  ];

  const validateForm = () => {
    if (!newContact.name || !newContact.phone) {
      alert('Name and phone number are required');
      return false;
    }
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(newContact.phone.replace(/\s+/g, ''))) {
      alert('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const addContact = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing && selectedContact) {
      setContacts(contacts.map(contact => 
        contact.id === selectedContact.id ? { ...newContact, id: contact.id } : contact
      ));
      setIsEditing(false);
    } else {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
    }
    
    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    });
    setSelectedContact(null);
  };

  const editContact = (contact) => {
    setNewContact(contact);
    setSelectedContact(contact);
    setIsEditing(true);
  };

  const deleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const callEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="emergency-container">
      <div className="emergency-header">
        <h2>Emergency Contacts</h2>
        <button 
          className="toggle-info-btn"
          onClick={() => setShowEmergencyInfo(!showEmergencyInfo)}
        >
          {showEmergencyInfo ? 'Hide Emergency Services' : 'Show Emergency Services'}
        </button>
      </div>

      {showEmergencyInfo && (
        <div className="emergency-services">
          <h3>Emergency Services Numbers</h3>
          <div className="services-grid">
            {emergencyServices.map((service, index) => (
              <div key={index} className="service-card">
                <h4>{service.name}</h4>
                <p>{service.number}</p>
                <button 
                  className="call-btn"
                  onClick={() => callEmergency(service.number)}
                >
                  Call Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="emergency-content">
        <form onSubmit={addContact} className="contact-form">
          <h3>{isEditing ? 'Edit Contact' : 'Add New Contact'}</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Name *"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Relationship"
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            />
            <textarea
              placeholder="Address"
              value={newContact.address}
              onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
            />
            <textarea
              placeholder="Additional Notes"
              value={newContact.notes}
              onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
            />
          </div>
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update Contact' : 'Add Contact'}
          </button>
        </form>

        <div className="contacts-list">
          <h3>Your Emergency Contacts</h3>
          {contacts.length === 0 ? (
            <p className="no-contacts">No emergency contacts added yet.</p>
          ) : (
            contacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <div className="contact-info">
                  <h4>{contact.name}</h4>
                  <p><strong>Relationship:</strong> {contact.relationship}</p>
                  <p><strong>Phone:</strong> {contact.phone}</p>
                  {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
                  {contact.address && <p><strong>Address:</strong> {contact.address}</p>}
                  {contact.notes && <p><strong>Notes:</strong> {contact.notes}</p>}
                </div>
                <div className="contact-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => editContact(contact)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteContact(contact.id)}
                  >
                    Delete
                  </button>
                  <button 
                    className="call-btn"
                    onClick={() => callEmergency(contact.phone)}
                  >
                    Call
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;