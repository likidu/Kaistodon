<script lang="ts">
  import Icon from '@/ui/components/icon/Icon.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Alignment, Color, IconSize } from '@/ui/enums';
  import { IconComment, IconMenu, IconReply, IconStar } from '@/ui/icons';
  import { delay } from '@/ui/utils/delay';

  import { usePublicTimeline } from '../services';

  const timeline = usePublicTimeline();
</script>

<View>
  <ViewHeader>
    <a href="#">Public</a>
    <a href="#">Federated</a>
  </ViewHeader>
  <ViewContent>
    {#if $timeline.status === 'loading'}
      <Typography align="center">Loading...</Typography>
    {:else if $timeline.status === 'error'}
      <Typography align="center">Error!</Typography>
    {:else}
      {@const statuses = $timeline.data}
      {#each statuses as status, i}
        {#if status.visibility === 'public'}
          <ListItem
            imageUrl={status.account.avatarStatic}
            align={Alignment.Top}
            titleText={status.account.displayName}
            secondaryText={status.account.url}
            navi={{ itemId: `timeline-${i + 1}`, onSelect: () => {} }}
            contextMenu={{
              title: `Primary Text ${i + 1}`,
              items: [
                {
                  label: 'Context Menu Item 1',
                  workingLabel: 'Working...',
                  onSelect: async () => {
                    console.log('context menu item 1');
                    await delay(1000);
                  },
                },
                {
                  label: 'Context Menu Item 2',
                  onSelect: async () => {
                    console.log('context menu item 2');
                    await delay(1000);
                  },
                },
                {
                  label: 'Context Menu Item 3',
                  onSelect: () => console.log('context menu item 3'),
                },
              ],
            }}
          >
            <svelte:fragment slot="content">
              {@html status.content}
            </svelte:fragment>
            <div slot="bottom">
              <section class="stats">
                <div class="item">
                  <Icon size={IconSize.Smallest} color={Color.Secondary}><IconReply /></Icon>
                  <span>{status.reblogsCount}</span>
                </div>
                <div class="item">
                  <Icon size={IconSize.Smallest} color={Color.Secondary}><IconStar /></Icon>
                  <span>{status.favouritesCount}</span>
                </div>
                <div class="item">
                  <Icon size={IconSize.Smallest} color={Color.Secondary}><IconComment /></Icon>
                  <span>{status.repliesCount}</span>
                </div>
              </section>
            </div>
          </ListItem>
        {/if}
      {/each}
    {/if}
  </ViewContent>
  <ViewFooter>
    <SoftKey
      ><div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
      <div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
    </SoftKey>
  </ViewFooter>
</View>

<style lang="postcss">
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
</style>
