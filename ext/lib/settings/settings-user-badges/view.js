/* global fetch */
import t from 't-component'
import 'whatwg-fetch'
import AddUserInput from 'ext/lib/admin/admin-permissions/add-user-input/add-user-input'
import FormView from 'lib/form-view/form-view'
import template from './template.jade'

export default class UserBadgeView extends FormView {
  constructor () {
    super(template)
    this.onSelect = this.onSelect.bind(this)
    this.onSubmitBadge = this.onSubmitBadge.bind(this)
    this.onSubmitVerify = this.onSubmitVerify.bind(this)
    this.addUserInput = new AddUserInput({
      onSelect: this.onSelect,
      container: this.el[0].querySelector('.user-search')
    })
    this.updateVerifiedUI(null)
  }

  onSelect (user) {
    this.messages([], 'badge-success')
    this.messages([], 'verify-success')
    this.messages([], 'error')
    this.selectedUser = user
    this.el[0].querySelector('.user-card').style.display = 'flex'
    this.el[0].querySelector('.picture').style.backgroundImage = 'url(' + user.avatar + ')'
    this.el[0].querySelector('.name').textContent = user.fullName
    this.el[0].querySelector('input[name="badge"]').value = user.badge || ''
    
    this.updateVerifiedUI(user)
    
    return Promise.resolve()
  }

  setBadge (badge) {
    return fetch('/api/settings/badges', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.selectedUser.id,
        badge
      })
    })
  }
  
  updateVerifiedUI(user){
    let btnVerify = this.el[0].querySelector('#submit-verify')
    btnVerify.className = 'btn btn-block btn-lg'
    if (user){      
      const userIsVerified = user.extra && user.extra.verified
      if (userIsVerified){
        this.el[0].querySelector('.user-is-verified').textContent = t('settings.user-badges.user-is-verified')
        btnVerify.className += ' btn-secondary'    
        btnVerify.disabled = true
      }else{
        this.el[0].querySelector('.user-is-verified').textContent = t('settings.user-badges.user-not-verified')  
        btnVerify.className += ' btn-info'    
        btnVerify.disabled = false
      }
    }else{
        this.el[0].querySelector('.user-is-verified').textContent = '' 
        btnVerify.className += ' btn-secondary'    
        btnVerify.disabled = true
    }
  }

  verifyUser () {
    const url = `/ext/api/user-verify/verify/${this.selectedUser.id}`
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin'
    })
  }

  onSubmitBadge (e) {
    if (!this.selectedUser) return
    var badge = this.el[0].querySelector('input[name="badge"]').value
    if (badge === this.selectedUser.badge) return

    this.setBadge(badge)
      .then((res) => {
        if (res.ok) {
          this.onBadgeSuccess()
        } else {
          this.onerror()
        }
      })
      .catch(() => { this.onerror() })
  }

  onSubmitVerify (e) {
    if (!this.selectedUser) return
    
    if (this.selectedUser.extra && this.selectedUser.extra.verified) return

    this.verifyUser()
      .then((res) => {
        if (res.ok) {
          this.onVerifySuccess()
        } else {
          this.onerror()
        }
      })
      .catch(() => { this.onerror() })
  }

  /**
   * Turn on event bindings
   */

  switchOn () {
    this.el[0].querySelector('#submit-badge').addEventListener('click', this.onSubmitBadge)
    this.el[0].querySelector('#submit-verify').addEventListener('click', this.onSubmitVerify)
    this.on('badge-success', this.onBadgeSuccess.bind(this))
    this.on('verify-success', this.onVerifySuccess.bind(this))
    this.on('error', this.onerror.bind(this))
  }

  /**
   * Turn off event bindings
   */

  switchOff () {
    this.off()
  }

  /**
   * Handle `error` event with
   * logging and display
   *
   * @param {String} error
   * @api private
   */

  onBadgeSuccess () {
    this.messages([t('settings.badge.success')], 'badge-success')
  }

  onVerifySuccess () {
    this.updateVerifiedUI({extra:{verified:true}})
    this.messages([t('settings.user-badges.verify-success')], 'verify-success')
  }

  /**
   * Handle current password is incorrect
   */

  onerror () {
    this.messages([t('common.internal-error')])
  }
}
