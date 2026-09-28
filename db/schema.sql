CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user','it','admin')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no VARCHAR(30) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requester_name VARCHAR(150),
  requester_email VARCHAR(255),
  unit VARCHAR(150),
  asset VARCHAR(150),
  category VARCHAR(80) NOT NULL DEFAULT 'Other',
  priority VARCHAR(20) NOT NULL DEFAULT 'Normal',
  status VARCHAR(30) NOT NULL DEFAULT 'Open',
  assignee VARCHAR(150),
  sla_due_at TIMESTAMPTZ,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_unit ON tickets(unit);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_requester_email ON tickets(requester_email);

CREATE TABLE IF NOT EXISTS ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_name VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket ON ticket_comments(ticket_id, created_at);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  actor VARCHAR(150) NOT NULL,
  action VARCHAR(80) NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ticket ON audit_logs(ticket_id, created_at);

CREATE TABLE IF NOT EXISTS ticket_counters (year INTEGER PRIMARY KEY,last_number INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sla_policies (priority VARCHAR(20) PRIMARY KEY,target_minutes INTEGER NOT NULL CHECK (target_minutes > 0),active BOOLEAN NOT NULL DEFAULT TRUE,updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
INSERT INTO sla_policies(priority,target_minutes) VALUES ('Critical',60),('High',240),('Normal',480),('Low',1440) ON CONFLICT(priority) DO NOTHING;

CREATE TABLE IF NOT EXISTS knowledge_case_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,ticket_no VARCHAR(30) NOT NULL,title VARCHAR(255) NOT NULL,category VARCHAR(80) NOT NULL DEFAULT 'Other',symptoms TEXT,root_cause TEXT,diagnosis TEXT,resolution TEXT NOT NULL,verification TEXT,escalation TEXT,keywords TEXT,markdown TEXT NOT NULL,status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Pending','Approved','Rejected','Published')),generated_by VARCHAR(150),reviewed_by VARCHAR(150),review_note TEXT,published_path TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),reviewed_at TIMESTAMPTZ,published_at TIMESTAMPTZ,UNIQUE(ticket_id)
);
CREATE INDEX IF NOT EXISTS idx_case_proposals_status ON knowledge_case_proposals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_proposals_ticket_no ON knowledge_case_proposals(ticket_no);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),recipient_email VARCHAR(255) NOT NULL,actor_email VARCHAR(255),type VARCHAR(50) NOT NULL,title VARCHAR(255) NOT NULL,message TEXT NOT NULL,link TEXT,ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,proposal_id UUID REFERENCES knowledge_case_proposals(id) ON DELETE CASCADE,is_read BOOLEAN NOT NULL DEFAULT FALSE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),read_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_email, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_proposal ON notifications(proposal_id, created_at DESC);
