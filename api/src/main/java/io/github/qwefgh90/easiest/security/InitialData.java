package io.github.qwefgh90.easiest.security;

public class InitialData {
    private String state;
    private String client_id;

    public InitialData(String state, String client_id) {
        this.state = state;
        this.client_id = client_id;
    }

    public InitialData() {
    }

    public String getState() {
        return state;
    }

    public String getClient_id() {
        return client_id;
    }
}
