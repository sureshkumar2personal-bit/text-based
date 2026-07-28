import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import AnimatedCounter from '../ui/AnimatedCounter';
import ModalPortal from '../ui/ModalPortal';

const STATUS_MAP = { draft: 'tag-yellow', active: 'tag-green', paused: 'tag-blue', stopped: 'tag-red' };
const GENERAL_PRICES = [99, 199, 299, 399];
const INDIVIDUAL_PRICES = [299, 399, 499, 599];
const DEFAULT_CATEGORIES = ['General Astrology', 'Career', 'Study/Education', 'Dosham', 'Health', 'Finance', 'Marriage', 'Relationship', 'Family', 'Business'];
const DEFAULT_LANGUAGES = ['English', 'Tamil', 'Tanglish'];
const EMPTY_CAMPAIGN_FORM = {
  campaignName: '',
  description: '',
  generalPrice: '',
  individualPrice: '',
  totalSlots: '',
  deadlineHours: '48',
  generalQuestionLimit: '0',
  individualQuestionLimit: '0',
  startAt: '',
  endAt: ''
};
const isWholeNumber = value => value !== '' && Number.isInteger(Number(value));

export default function AstroCampaigns({ astrologerId }) {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, allAstrologers } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(EMPTY_CAMPAIGN_FORM);

  const myCampaigns = campaigns.filter(c => c.astrologerId === astrologerId);
  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Astrologer';
  const totalSlotsValue = Number(form.totalSlots);
  const generalLimitValue = Number(form.generalQuestionLimit);
  const individualLimitValue = Number(form.individualQuestionLimit);
  const totalSlotsIsValid = isWholeNumber(form.totalSlots) && totalSlotsValue >= 1 && totalSlotsValue <= 500;
  const generalLimitIsValid = isWholeNumber(form.generalQuestionLimit) && generalLimitValue >= 0;
  const individualLimitIsValid = isWholeNumber(form.individualQuestionLimit) && individualLimitValue >= 0;
  const remainingSlots = totalSlotsValue - generalLimitValue - individualLimitValue;
  const allocationIsValid = totalSlotsIsValid && generalLimitIsValid && individualLimitIsValid &&
    generalLimitValue <= totalSlotsValue && individualLimitValue <= totalSlotsValue && remainingSlots === 0;
  const pricesAreValid = GENERAL_PRICES.includes(Number(form.generalPrice)) &&
    INDIVIDUAL_PRICES.includes(Number(form.individualPrice));
  const campaignFormIsValid = Boolean(form.campaignName) && pricesAreValid && allocationIsValid;

  const totalSlotsError = form.totalSlots !== '' && (
    !isWholeNumber(form.totalSlots) ? 'Total Slots must be a whole number.'
      : totalSlotsValue < 1 ? 'Total Slots must be at least 1.'
        : totalSlotsValue > 500 ? 'Total Slots cannot be more than 500.' : ''
  );
  const generalLimitError = form.generalQuestionLimit !== '' && (
    !generalLimitIsValid ? 'General Question Limit must be a non-negative whole number.'
      : totalSlotsIsValid && generalLimitValue > totalSlotsValue ? 'General Question Limit cannot exceed Total Slots.' : ''
  );
  const individualLimitError = form.individualQuestionLimit !== '' && (
    !individualLimitIsValid ? 'Individual Question Limit must be a non-negative whole number.'
      : totalSlotsIsValid && individualLimitValue > totalSlotsValue ? 'Individual Question Limit cannot exceed Total Slots.' : ''
  );
  const combinedLimitError = totalSlotsIsValid && generalLimitIsValid && individualLimitIsValid && (
    generalLimitValue + individualLimitValue > totalSlotsValue
      ? 'General and Individual limits cannot exceed Total Slots.'
      : generalLimitValue + individualLimitValue < totalSlotsValue
        ? 'Allocate all Total Slots between General and Individual questions.' : ''
  );

  const openNew = () => {
    setEdit(null);
    setForm(EMPTY_CAMPAIGN_FORM);
    setShowForm(true);
  };
  const openEdit = (c) => {
    setEdit(c);
    setForm({
      campaignName: c.campaignName,
      description: (c.description || '').slice(0, 50),
      generalPrice: GENERAL_PRICES.includes(Number(c.generalPrice)) ? Number(c.generalPrice) : '',
      individualPrice: INDIVIDUAL_PRICES.includes(Number(c.individualPrice)) ? Number(c.individualPrice) : '',
      totalSlots: String(c.totalSlots - c.soldSlots),
      deadlineHours: String(c.deadlineHours),
      generalQuestionLimit: String(c.generalQuestionLimit),
      individualQuestionLimit: String(c.individualQuestionLimit),
      startAt: c.startAt || '',
      endAt: c.endAt || ''
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!pricesAreValid) return toast.error('Select a valid general and individual price.');
    if (!allocationIsValid) return toast.error('Allocate all Total Slots correctly before saving.');

    if (edit) {
      updateCampaign(edit.id, {
        ...form,
        generalPrice: Number(form.generalPrice),
        individualPrice: Number(form.individualPrice),
        price: Number(form.generalPrice),
        totalSlots: edit.soldSlots + Number(form.totalSlots),
        submissionMode: edit.submissionMode || 'text',
        answerMode: edit.answerMode || 'text',
        categories: edit.categories?.length ? edit.categories : DEFAULT_CATEGORIES,
        languages: edit.languages?.length ? edit.languages : DEFAULT_LANGUAGES
      });
    } else {
      const c = { id: `cmp-${Date.now()}`, astrologerId, campaignName: form.campaignName, campaignCode: `CMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, description: form.description, generalPrice: Number(form.generalPrice), individualPrice: Number(form.individualPrice), price: Number(form.generalPrice), currency: 'INR', totalSlots: Number(form.totalSlots), soldSlots: 0, availableSlots: Number(form.totalSlots), generalQuestionLimit: Number(form.generalQuestionLimit), individualQuestionLimit: Number(form.individualQuestionLimit), submissionMode: 'text', answerMode: 'text', deadlineHours: Number(form.deadlineHours), status: 'draft', categories: DEFAULT_CATEGORIES, languages: DEFAULT_LANGUAGES, startAt: form.startAt || null, endAt: form.endAt || null, createdAt: new Date().toISOString() };
      addCampaign(c);
    }
    setShowForm(false);
    toast.success(edit ? 'Campaign updated!' : 'Campaign created!');
    if (edit) {
      addNotification(NOTIF_TYPES.CAMPAIGN_REVIEW, 'Campaign Updated', `"${edit.campaignName}" has been updated by ${astroName}`, 'platform', { tab: 'campaigns' });
    } else {
      addNotification(NOTIF_TYPES.CAMPAIGN_REVIEW, 'Campaign Needs Review', `"${form.campaignName}" created by ${astroName}`, 'platform', { tab: 'campaigns' });
    }
  };

  const changeStatus = (id, status) => {
    if (status === 'activate' || status === 'resume') {
      const c = campaigns.find(x => x.id === id);
      if (c.generalPrice <= 0 || c.individualPrice <= 0 || c.totalSlots <= 0) return toast.error('Cannot activate: prices and totalSlots must be > 0');
      updateCampaign(id, { status: 'active', availableSlots: c.totalSlots - c.soldSlots });
      toast.success(`Campaign "${c.campaignName}" is now active!`);
      addNotification(NOTIF_TYPES.CAMPAIGN_ACTIVATED, 'Campaign Activated', `"${c.campaignName}" is now live and accepting questions`, 'astrologer', { tab: 'campaigns' });
      addNotification(NOTIF_TYPES.CAMPAIGN_ACTIVATED, 'New Campaign Available', `"${c.campaignName}" by ${astroName} is now accepting questions`, 'user', { tab: 'questions' });
    } else if (status === 'pause') {
      updateCampaign(id, { status: 'paused' });
      const c = campaigns.find(x => x.id === id);
      toast.info(`Campaign "${c.campaignName}" paused`);
      addNotification(NOTIF_TYPES.CAMPAIGN_PAUSED, 'Campaign Paused', `"${c.campaignName}" is paused — no new purchases`, 'astrologer', { tab: 'campaigns' });
      addNotification(NOTIF_TYPES.CAMPAIGN_PAUSED, 'Campaign Paused', `"${c.campaignName}" has been paused and is no longer accepting new purchases`, 'user', { tab: 'questions' });
    }
  };

  const totalSlots = myCampaigns.reduce((s, c) => s + c.totalSlots, 0);
  const totalSold = myCampaigns.reduce((s, c) => s + c.soldSlots, 0);

  return (
    <div>
      <div className="card card-gradient-border" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="gradient-text">✨ {astroName}'s Campaigns</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <AnimatedCounter value={myCampaigns.length} /> campaigns · <AnimatedCounter value={totalSlots} /> total slots · <AnimatedCounter value={totalSold} /> sold
          </p>
        </div>
        <button className="btn btn-primary btn-glow" onClick={openNew}>+ New Campaign</button>
      </div>

      <div className="grid">
        {myCampaigns.map(c => {
          const pct = c.totalSlots > 0 ? Math.round(c.soldSlots / c.totalSlots * 100) : 0;
          return (
            <div className="card" key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{c.campaignName}</h3>
                <span className={`tag ${STATUS_MAP[c.status]}`}>{c.status}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{c.description}</p>
              <div className="row" style={{ marginBottom: '0.5rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>General</span><br />₹{c.generalPrice}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Individual</span><br />₹{c.individualPrice}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Mode</span><br />{c.submissionMode}/{c.answerMode}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Deadline</span><br />{c.deadlineHours}h</div>
              </div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Slots: {c.soldSlots}/{c.totalSlots}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {c.categories.map(cat => <span className="tag tag-blue" key={cat}>{cat}</span>)}
                {c.languages.map(l => <span className="tag tag-purple" key={l}>{l}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {c.status === 'draft' && <button className="btn btn-success btn-sm" onClick={() => changeStatus(c.id, 'activate')}>Activate</button>}
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                {c.status === 'active' && <button className="btn btn-secondary btn-sm" onClick={() => changeStatus(c.id, 'pause')}>Pause</button>}
                {c.status === 'paused' && <button className="btn btn-success btn-sm" onClick={() => changeStatus(c.id, 'resume')}>Resume</button>}
                <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Delete this campaign?')) { deleteCampaign(c.id); toast.success(`Campaign "${c.campaignName}" deleted`); addNotification(NOTIF_TYPES.CAMPAIGN_STOPPED, 'Campaign Deleted', `Campaign "${c.campaignName}" has been deleted by ${astroName}`, 'platform', { tab: 'campaigns' }); } }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <ModalPortal onClose={() => setShowForm(false)}>
          <div className="modal campaign-form-modal" onClick={e => e.stopPropagation()}>
            <h2>{edit ? 'Edit Campaign' : 'New Campaign'}</h2>
            <div className="campaign-form-section-title">📦 Campaign Details</div>
            <div className="form-group"><label>Campaign Name</label><input value={form.campaignName} onChange={e => setForm({...form, campaignName: e.target.value})} placeholder="e.g. Career Guidance" /></div>
            <div className="form-group">
              <label htmlFor="campaign-description">
                Description
                <span className="character-count">{form.description.length}/50</span>
              </label>
              <input
                id="campaign-description"
                type="text"
                value={form.description}
                maxLength={50}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Briefly describe this campaign"
              />
            </div>

            <div className="campaign-form-section-title">📅 Schedule</div>
            <div className="row">
              <div className="form-group"><label>Start At</label><input type="datetime-local" value={form.startAt ? form.startAt.slice(0, 16) : ''} onChange={e => setForm({...form, startAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} /></div>
              <div className="form-group"><label>End At</label><input type="datetime-local" value={form.endAt ? form.endAt.slice(0, 16) : ''} onChange={e => setForm({...form, endAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} /></div>
            </div>

            <div className="campaign-form-section-title">💳 Pricing</div>
            <div className="row">
              <div className="form-group">
                <label htmlFor="general-price">General Price (₹)</label>
                <select id="general-price" value={form.generalPrice} onChange={e => setForm({...form, generalPrice: e.target.value ? Number(e.target.value) : ''})}>
                  <option value="">Select general price</option>
                  {GENERAL_PRICES.map(price => <option key={price} value={price}>₹{price}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="individual-price">Individual Price (₹)</label>
                <select id="individual-price" value={form.individualPrice} onChange={e => setForm({...form, individualPrice: e.target.value ? Number(e.target.value) : ''})}>
                  <option value="">Select individual price</option>
                  {INDIVIDUAL_PRICES.map(price => <option key={price} value={price}>₹{price}</option>)}
                </select>
              </div>
            </div>

            <div className="campaign-form-section-title">⚙️ Slot Allocation</div>
            <div className="row">
              <div className="form-group">
                <label>{edit ? 'Available Slots' : 'Total Slots'}</label>
                <input type="number" min="1" max="500" step="1" value={form.totalSlots} onChange={e => setForm({...form, totalSlots: e.target.value})} placeholder="50" aria-invalid={Boolean(totalSlotsError)} />
                {edit && <div className="helper">{edit.soldSlots} slot{edit.soldSlots !== 1 ? 's' : ''} already purchased — editing available slots only</div>}
                {totalSlotsError && <div className="campaign-field-error">{totalSlotsError}</div>}
              </div>
              <div className="form-group"><label>Deadline (hours)</label><input type="number" value={form.deadlineHours} onChange={e => setForm({...form, deadlineHours: e.target.value})} placeholder="48" /></div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>General Question Limit</label>
                <input type="number" min="0" max={totalSlotsIsValid ? totalSlotsValue : 500} step="1" value={form.generalQuestionLimit} onChange={e => setForm({...form, generalQuestionLimit: e.target.value})} placeholder="40" aria-invalid={Boolean(generalLimitError)} />
                {generalLimitError && <div className="campaign-field-error">{generalLimitError}</div>}
              </div>
              <div className="form-group">
                <label>Individual Question Limit</label>
                <input type="number" min="0" max={totalSlotsIsValid ? totalSlotsValue : 500} step="1" value={form.individualQuestionLimit} onChange={e => setForm({...form, individualQuestionLimit: e.target.value})} placeholder="10" aria-invalid={Boolean(individualLimitError)} />
                {individualLimitError && <div className="campaign-field-error">{individualLimitError}</div>}
              </div>
            </div>
            {combinedLimitError && <div className="campaign-field-error campaign-allocation-error">{combinedLimitError}</div>}
            {totalSlotsIsValid && generalLimitIsValid && individualLimitIsValid && (
              <div className={`campaign-allocation-status ${remainingSlots === 0 ? 'is-complete' : remainingSlots < 0 ? 'is-over' : ''}`}>
                {remainingSlots === 0
                  ? `All ${totalSlotsValue} ${totalSlotsValue === 1 ? 'slot' : 'slots'} allocated`
                  : remainingSlots > 0
                    ? `${remainingSlots} ${remainingSlots === 1 ? 'slot' : 'slots'} remaining to allocate`
                    : `Allocation exceeds Total Slots by ${Math.abs(remainingSlots)}`}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!campaignFormIsValid}>{edit ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
