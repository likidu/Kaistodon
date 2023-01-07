<script lang="ts">
  import type { mastodon } from 'masto';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { client } from '@/lib/services';

  const statuses = client.v1.trends.listStatuses({
    limit: 3,
  });

  async function getStatuses(pageParam: boolean): Promise<mastodon.v1.Status[]> {
    console.log('triggered, next is', pageParam);
    if (pageParam) {
      const { value } = await statuses.next();
      console.log(value);
      return value;
    } else {
      return await statuses;
    }
  }
</script>

<StatusList queryKey="trend-status" queryFn={({ pageParam }) => getStatuses(pageParam)} />
