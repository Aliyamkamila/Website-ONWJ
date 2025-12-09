<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'ip_address',
        'admin_notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope for new contacts
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope for read contacts
     */
    public function scopeRead($query)
    {
        return $query->where('status', 'read');
    }

    /**
     * Scope for replied contacts
     */
    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
    }

    /**
     * Scope for recent contacts
     */
    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Check if contact is new
     */
    public function isNew(): bool
    {
        return $this->status === 'new';
    }

    /**
     * Check if contact is read
     */
    public function isRead(): bool
    {
        return $this->status === 'read';
    }

    /**
     * Check if contact is replied
     */
    public function isReplied(): bool
    {
        return $this->status === 'replied';
    }

    /**
     * Mark as read
     */
    public function markAsRead()
    {
        if ($this->status === 'new') {
            $this->update(['status' => 'read']);
        }
    }

    /**
     * Mark as replied
     */
    public function markAsReplied()
    {
        $this->update(['status' => 'replied']);
    }
}